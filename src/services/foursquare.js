const request = require("request");
const qs = require("querystring");

const CLIENT_ID = "X0RW5VUZGDQWTJ4G4FE3H3KUW2ZJWUVHOR5RALZOH5UEY34I";
const CLIENT_SECRET = "DVYAVTHMYFZDLBGHYJKYM5BP1TSCLR5ZG2G4KQBPUVYFCRFX";

module.exports.searchVenues = function (query, ll, v) {
  return new Promise((resolve, reject) => {
    request.get("https://api.foursquare.com/v2/venues/search?" + qs.encode({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
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
