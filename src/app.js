const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const router = require("./router");
const communityEventRouter = require("./event-sourcing/community-event-router");
const logger = require("./logger");
const conf = require("./config");
const morgan = require("morgan");

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

  app.use("/", router);
  app.use("/api", communityEventRouter);

  app.use(express.static("public"));

  var server = app.listen(conf.get("APP_NODEJS_PORT"), () => {
    var host = server.address().address;
    var port = server.address().port;

    logger.debug(`App worker ${cluster.worker.id} listening at http://${host}:${port}`);
  });
};
