"use strict";

const router = require("express").Router();
const uuid = require("node-uuid");
const lodash = require("lodash");
const logger = require("../logger");
const communityEventQueue = require("./community-event-queue");
const communitiesModel = require("../models/communities-model");
const communityCommands = require("./community-constants").commands;
const communityValidator = require("../models/community-validator");

router.get("/community", (req, res) => {
  communitiesModel.findAll().then(communities => {
    res.json(communities);
  }).catch(error => {
    logger.error(error);
    // TODO Security: too much info in error
    res.status(500).json(error);
  });
});

router.post("/community", communityValidator.middleware, (req, res) => {
  const community = req.$community;
  const communityId = uuid.v4();
  communitiesModel.exist(community.name).then(isExist => {
    if (isExist) {
      res.status(400).json({
        message: "Community already exist"
      });
    } else {
      communityEventQueue.add({
        type: communityCommands.community_create,
        data: {
          community_id: communityId,
          name: community.name,
          description: community.description,
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

router.put("/community/:community_id", (req, res) => {
  // TODO validate update data
  const community_id = req.params.community_id;
  const user = {
    user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
  };
  const update = req.body;
  communitiesModel.findById(community_id).then(community => {
    return communityEventQueue.add({
      type: communityCommands.community_update,
      data: {
        community_id: community_id,
        user: user,
        update: update
      }
    });
  }).then(() => {
    res.json(update);
  }).catch(error => {
    // TODO Security: too much info in error
    res.status(500).json(error);
  });
});

router.delete("/community/:community_id", (req, res) => {
  // TODO validate update data
  // TODO debug event user_id: null
  const community_id = req.params.community_id;
  const user = {
    user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
  };
  communitiesModel.findById(community_id).then(community => {
    return communityEventQueue.add({
      type: communityCommands.community_delete,
      data: {
        community_id: community_id,
        user: user,
        update: {
          deleted: true
        }
      }
    });
  }).then(() => {
    res.json({});
  }).catch(error => {
    // TODO Security: too much info in error
    res.status(500).json(error);
  });
});

router.post("/community/:community_id/adduser/:user_id", (req, res) => {
  // TODO remove user_id from url and put her in body
  // TODO check if user exist
  // TODO check if community exist
  const user_id = req.params.user_id;
  const community_id = req.params.community_id;
  communitiesModel.findById(community_id).then(community => {
    if (lodash.contains(community.users, user_id)) {
      return Promise.reject({
        code: 400,
        message: "user already added"
      });
    } else {
      return communityEventQueue.add({
        type: communityCommands.community_add_user,
        data: {
          community_id: community_id,
          user_id: user_id
        }
      });
    }
  }).then(() => {
    res.json({});
  }).catch(error => {
    res.status(error.code).json(error);
  });
});

module.exports = router;
