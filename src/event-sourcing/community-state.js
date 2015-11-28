const communityEvents = require("./community-constants").events;

/**
 * Compute community state
 * @param events
 * @return Promise state
*/
function computeCommunityState(events) {
  return new Promise((resolve, reject) => {
    const state = events.reduce((acc, event) => {
      switch (event.event_type) {
        case communityEvents.community_created:
          return {
            name: event.name,
            description: event.description,
            community_id: event.community_id,
            users: []
          };
        case communityEvents.community_user_added:
          acc.users.push(event.user_id);
          return acc;
        case communityEvents.community_updated:
          if (event.update["name"]) acc["name"] = event.update["name"];
          if (event.update["description"]) acc["description"] = event.update["description"];
          return acc;
        default:
          // TODO think to how stop the reduce function
          reject({ message: "Unknown community event" });
          return acc;
      }
    }, {});
    resolve(state);
  });
}

module.exports = computeCommunityState;
