"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const router = require("./router");
const logger = require("./logger");
const conf = require("./config");
const morgan = require("morgan");
const localAuth = require("./auth/auth-local");
const mongoose = require("mongoose");

module.exports = function (cluster) {
    const app = express();

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(bodyParser.json());

    app.use(cookieParser());

    app.use(session({
        secret: conf.get("APP_SESSION_SECRET"),
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));

    if (conf.get("REQUEST_LOGS")) {
        app.use(morgan(conf.get("REQUEST_LOGS_TYPE"), {
            stream: logger.stream
        }));
    }

    mongoose.Promise = Promise;
    mongoose.connect(`mongodb://${conf.get("MONGODB_HOST")}:${conf.get("MONGODB_PORT")}/ouquonmange`);

    app.post("/auth/local/signup", localAuth.localSignup);
    app.post("/auth/local/signup", localAuth.localSignup);
    

    app.use(express.static("public"));

    const server = app.listen(conf.get("APP_NODEJS_PORT"), () => {
        const host = server.address().address;
        const port = server.address().port;

        logger.debug(`App worker ${cluster.worker.id} listening at http://${host}:${port}`);
    });
};
