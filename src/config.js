"use strict";

const nconf = require("nconf");

nconf.argv().env().file({
    file: "./conf/config.json"
});

module.exports = nconf;
