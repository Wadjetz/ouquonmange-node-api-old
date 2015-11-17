const router = require("express").Router();
const uuid = require("node-uuid");
const logger = require("../logger");
const communityEventQueue = require("./community-event-queue");
const communitiesModel = require("../models/communities-model");
const communityCommands = require("./community-constants").commands;

router.get("/community", (req, res) => {
  communitiesModel.findAll().then(communities => {
    res.json(communities);
  }).catch(error => {
    logger.error(error);
    res.status(500).json(error); // TODO Security: too much info in error
  });
});

router.post("/community", (req, res) => {
  // TODO Validate data
  const communityName = req.body.name;
  const communityId = uuid.v4();

  communitiesModel.exist(communityName).then(isExist => {
    if (isExist) {
      res.status(400).json({
        message: "Community already exist"
      });
    } else {
      communityEventQueue.add({
        type: communityCommands.community_create,
        data: {
          community_id: communityId,
          name: communityName,
          user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
        }
      }).then(() => {
        res.json({
          community_id: communityId
        });
      });
    }
  }).catch(error => {
    logger.error(error);
    res.status(500).json(error); // TODO Security: too much info in error
  });
});

router.post("/community/:community_id/adduser/:user_id", (req, res) => {
  // TODO check if user exist
  // TODO check if community exist
  const user_id = req.params.user_id;
  const community_id = req.params.community_id;
  communityEventQueue.add({
    type: communityCommands.community_add_user,
    data: {
      community_id: community_id,
      user_id: user_id
    }
  }).then(() => res.json({}));
});

module.exports = router;
