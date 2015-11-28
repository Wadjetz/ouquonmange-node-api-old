"use strict";

const validate = require("validate.js");
const moment = require("moment");
validate.moment = moment;

const constraints = {
  name: {
    presence: true
  },
  description: {
    presence: true
  }
};

module.exports.middleware = function (req, res, next) {
  const community = {
    name: req.body.name,
    description: req.body.description
  };
  validate.async(community, constraints).then(community => {
    req.$community = community;
    next();
  }).catch(error => res.status(400).json(error));
};
