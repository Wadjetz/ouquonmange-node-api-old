"use strict";

const BullQueue = require("bull");
const es = require("./event-store");
const logger = require("../logger");
const computeCommunityState = require("./community-state");
const computeCommunityCommand = require("./community-command");
const communityProjection = require("./community-projection");
const conf = require("../config");
const communityCommands = require("./community-constants").commands;

const communityEventQueue = BullQueue("community_event_queue", conf.get("REDIS_PORT"), conf.get("REDIS_HOST"));

// TODO refactor this code for remove code duplication

function processCommunity(command, done) {
  es.findByCommunityId(command.data.community_id).then(events => {
    logger.debug("findByCommunityId =", events.length);
    return computeCommunityState(events);
  }).then(state => {
    logger.debug("computeCommunityState =", state);
    return computeCommunityCommand(command, state);
  }).then(resultEvents => {
    logger.debug("computeCommunityCommand = ", resultEvents.length);
    return Promise.all(resultEvents.map(event => es.insert(event)));
  }).then(insertedEvents => {
    logger.debug("insertedEvents = ", insertedEvents.length);
    return Promise.all(insertedEvents.map(event => communityProjection(event)));
  }).then(projectedEvents => {
    logger.debug("projectedEvents = ", projectedEvents.length);
    done();
  }).catch(error => {
    logger.error("error =", error);
    done();
  });
}

communityEventQueue.process((job, done) => {
  const command = job.data;
  logger.debug("EventQueue process command: ", command);
  switch (command.type) {
    case communityCommands.community_create:
      // TODO create message queue for creation
      // TODO check if community already exist
      computeCommunityCommand(command, {}).then(resultEvents => {
        logger.debug("computeCommunityCommand", resultEvents.length);
        return Promise.all(resultEvents.map(event => es.insert(event)));
      }).then(insertedEvents => {
        logger.debug("insertedEvents", insertedEvents.length);
        return Promise.all(insertedEvents.map(event => communityProjection(event)));
      }).then(projectedEvents => {
        logger.debug("projectedEvents = ", projectedEvents.length);
        done();
      }).catch(error => {
        logger.error(error);
        done();
      });
      break;
    case communityCommands.community_add_user:
      processCommunity(command, done);
      break;
    case communityCommands.community_update:
      processCommunity(command, done);
      break;
    case communityCommands.community_delete:
      processCommunity(command, done);
      break;
    case communityCommands.community_migration:
      logger.warn("process migration");
      es.findAll().then(events => {
        logger.debug("communityProjection =", events.length);
        return Promise.all(events.map(event => communityProjection(event)));
      }).then(result => {
        logger.debug("communityProjection =", result.length);
        done();
      }).catch(error => {
        logger.error(error);
        done();
      });
      break;
    default:
      logger.error("process unknown command");
      done();
  }
});

module.exports = communityEventQueue;
