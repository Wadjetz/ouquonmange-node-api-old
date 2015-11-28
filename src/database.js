"use strict";

const Db = require("mongodb").Db;
const Server = require("mongodb").Server;
const logger = require("./logger");
const conf = require("./config");

const mongoDbHost = conf.get("MONGODB_HOST") || "localhost";
const mongoDbPort = conf.get("MONGODB_PORT") || 27017;

const mongoDbServer = new Server(mongoDbHost, mongoDbPort, { auto_reconnect: true }, {});

const db = new Db("ouquonmange", mongoDbServer);

db.open(function(){
  logger.debug("Mongodb connection open");
});

module.exports = db;
