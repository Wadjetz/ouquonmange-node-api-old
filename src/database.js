"use strict";

const Db = require("mongodb").Db;
const Server = require("mongodb").Server;

const db = new Db("ouquonmange", new Server("localhost", 27017, { auto_reconnect: true }, {}));

db.open(function(){
    console.log("Mongodb connection open");
});

module.exports = db;
