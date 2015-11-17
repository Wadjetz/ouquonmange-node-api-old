const communitiesModel = require("../models/communities-model");
const communityEvents = require("./community-constants").events;

/**
 * Communities Projection
 * Modifying the model based on an event
 * @param event
 * @return Promise<Community>
*/
function projection(event) {
  switch (event.event_type) {
    case communityEvents.community_created:
      return communitiesModel.insert({
        community_id: event.community_id,
        name: event.name,
        created: event.created,
        users: []
      });
    case communityEvents.community_user_added:
      return communitiesModel.addUser(event.community_id, event.user_id);
    default:
      return Promise.reject("projection unknown event");
  }
}

module.exports = projection;