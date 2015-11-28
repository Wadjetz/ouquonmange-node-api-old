"use strict";

const DB = require("./../database");
const Timestamp = require("mongodb").Timestamp;

const collection = DB.collection("eventstore");

module.exports.insert = function (event) {
  return new Promise(function(resolve, reject) {
    event.created = Timestamp.fromNumber(Date.now());
    collection.insert(event, (error, result) => {
      if (error) reject(error);
      else if (result.insertedCount > 0) resolve(result.ops[0]);
      else reject({
        code: 500,
        message: "Zero document inserted"
      });
    });
  });
};

module.exports.findAll = function () {
  return new Promise(function(resolve, reject) {
    collection.find({}).sort({
      created: 1
    }).toArray((error, events) => {
      if (error) reject(error);
      else resolve(events);
    });
  });
};

module.exports.findByCommunityId = function (community_id) {
  return new Promise(function(resolve, reject) {
    collection.find({
      community_id: community_id
    }).sort({
      created: 1
    }).toArray((error, events) => {
      if (error) reject(error);
      else if (events.length === 0) reject({ message: "Events By CommunityId not found" });
      else resolve(events);
    });
  });
};
