"use strict";

const uuid = require("node-uuid");
const lodash = require("lodash");
const communityEvents = require("./community-constants").events;
const communityCommands = require("./community-constants").commands;

/**
 * Compute community command
 * @param command @type Command
 * @param state @type State
 * @return Promise<Array<Event>> events
 */
function computeCommunityCommand(command, state) {
  return new Promise((resolve, reject) => {
    switch (command.type) {
      case communityCommands.community_create:
        resolve([{
          event_id: uuid.v4(),
          event_type: communityEvents.community_created,
          community_id: command.data.community_id,
          name: command.data.name,
          description: command.data.description
        }, {
          event_id: uuid.v4(),
          event_type: communityEvents.community_user_added,
          community_id: command.data.community_id,
          user_id: command.data.user_id
        }]);
        break;
      case communityCommands.community_add_user:
        if (lodash.contains(state.users, command.data.user_id)) {
          reject({
            message: command.data.user_id + " user already added"
          });
        } else {
          resolve([{
            event_id: uuid.v4(),
            event_type: communityEvents.community_user_added,
            community_id: command.data.community_id,
            user_id: command.data.user_id
          }]);
        }
        break;
      case communityCommands.community_update:
        let update = {};
        if (command.data.update["name"]) {
          update["name"] = command.data.update["name"];
        }
        if (command.data.update["description"]) {
          update["description"] = command.data.update["description"];
        }
        resolve([{
          event_id: uuid.v4(),
          event_type: communityEvents.community_updated,
          community_id: command.data.community_id,
          update: update
        }]);
        break;
      case communityCommands.community_delete:
        resolve([{
          event_id: uuid.v4(),
          event_type: communityEvents.community_deleted,
          community_id: command.data.community_id,
          user_id: command.data.user_id,
          update: {
            deleted: true
          }
        }]);
        break;
      default: reject({
        message: "unknown command"
      });
    }
  });
}

module.exports = computeCommunityCommand;
