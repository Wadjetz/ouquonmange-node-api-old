const cluster = require("cluster");
const app = require("./app");
const logger = require("./logger");

module.exports = function () {
  cluster.schedulingPolicy = cluster.SCHED_RR;

  if(cluster.isMaster) {
    const cpuCount = 1; //require("os").cpus().length;

    for (var i=0; i < cpuCount; i++) {
      cluster.fork();
    }
  } else {
    app(cluster);
  }

  cluster.on("fork", worker =>
    logger.debug("forked -> Worker %d", worker.id)
  );

};
