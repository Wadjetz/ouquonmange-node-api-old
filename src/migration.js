const DB = require("./database");
const conf = require("./config");
const logger = require("./logger");
const communitiesModel = require("./models/communities-model");
const communityEventQueue = require("./event-sourcing/community-event-queue");

if (conf.get("migration")) {
  logger.warn("MIGRATION ENABLED");

  DB.open(() => {
    logger.debug("mongo open for migration");
    communitiesModel.deleteAll().then(result => {
      logger.warn("Delete all communities model. Deleted =", result);
      communityEventQueue.add({
        type: "community_migration"
      }).then((() => {
        logger.warn("Send communities migration command");
      }));
    }).catch(error => {
      logger.error(error);
    });
  });
} else {
  logger.info("migration disabled");
}





