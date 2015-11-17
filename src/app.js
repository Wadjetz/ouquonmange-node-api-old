const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const router = require("./router");
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
    secret: "sd6!sd*dguie5§TFGd0s+Rt=ZZE623",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  if (conf.get("REQUEST_LOGS")) {
    app.use(morgan("combined", {
      stream: logger.stream
    }));
  }

  app.use("/", router);

  app.use(express.static("public"));

  var server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`App worker ${cluster.worker.id} listening at http://${host}:${port}`);
  });
};
