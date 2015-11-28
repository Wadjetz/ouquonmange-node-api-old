"use strict";

const DB = require("./../database");

const collection = DB.collection("communities");
// TODO use mongodb promises (mongo api return promise if callback undefined)

module.exports.insert = function (community) {
  return new Promise(function(resolve, reject) {
    collection.insert(community, (error, result) => {
      if (error) reject(error);
      else if (result.insertedCount > 0) resolve(result.ops[0]);
      else reject({
        code: 500,
        message: "Zero document inserted"
      });
    });
  });
};

module.exports.findByName = function (communityName) {
  return new Promise(function(resolve, reject) {
    collection.find({
      name: communityName
    }).limit(1).next((error, community) => {
      if (error) reject(error);
      else if(community) resolve(community);
      else reject({
        code: 404,
        message: "Document not found"
      });
    });
  });
};

module.exports.findAll = function () {
  return new Promise(function(resolve, reject) {
    collection.find({}).toArray((error, community) => {
      if (error) reject(error);
      else if(community) resolve(community);
      else reject({
          code: 404,
          message: "Document not found"
        });
    });
  });
};

module.exports.findById = function (communityId) {
  return new Promise((resolve, reject) => {
    collection.find({
      community_id: communityId
    }).limit(1).next((error, community) => {
      if (error) reject(error);
      else if (community) resolve(community);
      else reject({
        code: 404,
        message: "Not found"
      });
    });
  });
};

module.exports.exist = function (communityName) {
  return new Promise(function(resolve, reject) {
    collection.find({
      name: communityName
    }).limit(1).count((error, community) => {
      if (error) reject(error);
      else if (community > 0) resolve(true);
      else resolve(false);
    });
  });
};

module.exports.update = function(communityId, communityUpdate) {
  return new Promise((resolve, reject) => {
    const query = {
      community_id: communityId
    };
    const update = {
      $set: communityUpdate
    };
    const options = {
      returnOriginal: false
    };
    collection.findOneAndUpdate(query, update, options, (error, events) => {
      if (error) reject(error);
      else resolve(events);
    });
  });
};

module.exports.addUser = function (community_id, user_id) {
  return new Promise(function(resolve, reject) {

    const query = {
      community_id: community_id
    };

    const update = {
      $push: {
        users: user_id
      }
    };

    const options = {
      returnOriginal: false
    };

    collection.findOneAndUpdate(query, update, options, (error, events) => {
      if (error) reject(error);
      else resolve(events);
    });

  });
};

module.exports.deleteAll = function () {
  return new Promise(function(resolve, reject) {
    collection.deleteMany({}, function(error, result) {
      if (error) reject(error);
      else resolve(result.deletedCount);
    });
  });
};
