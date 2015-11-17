const request = require("request");
const qs = require("querystring");
const conf = require("../config");

const FOURSQUARE_CLIENT_ID = conf.get("FOURSQUARE_CLIENT_ID");
const FOURSQUARE_CLIENT_SECRET = conf.get("FOURSQUARE_CLIENT_SECRET");

module.exports.searchVenues = function (query, ll, v) {
  return new Promise((resolve, reject) => {
    request.get("https://api.foursquare.com/v2/venues/search?" + qs.encode({
      client_id: FOURSQUARE_CLIENT_ID,
      client_secret: FOURSQUARE_CLIENT_SECRET,
      ll: ll,
      v: v,
      query: query
    }), (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      }
    });
  });
};

module.exports.exploreVenues = function (section, query, ll, v) {
  return new Promise((resolve, reject) => {
    request.get("https://api.foursquare.com/v2/venues/explore?" + qs.encode({
      client_id: FOURSQUARE_CLIENT_ID,
      client_secret: FOURSQUARE_CLIENT_SECRET,
      ll: ll,
      v: v,
      section: section,
      query: query
    }), (error, response, body) => {
      if(error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      }
    });
  });
};
