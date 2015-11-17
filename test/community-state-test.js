const describe = require("mocha/lib/mocha").describe;
const it = require("mocha/lib/mocha").it;
const expect = require("chai").expect;
const computeCommunityState = require("../src/event-sourcing/community-state");
const communityEvents = require("../src/event-sourcing/community-constants").events;

const communityCreateEvent = {
  event_id: "aefb3846-ab9b-4153-a90f-fc520befb182",
  event_type: communityEvents.community_created,
  community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
  name: "Ouquonmange Team"
};

const communityAddUserEvent = {
  event_id: "105c42a8-4134-41b0-9f30-57507e49f2b2",
  event_type: communityEvents.community_user_added,
  community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
  user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
};

const communityUnknownEvent = {
  event_id: "",
  event_type: "unknown",
  community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66"
};

const events = [communityCreateEvent, communityAddUserEvent];

describe("Community state", () => {
  describe("Compute community state", () => {
    it("should compute state", () => {
      return computeCommunityState(events).then(state => {
        expect(state).to.deep.equal({
          name: "Ouquonmange Team",
          community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
          users: [
            "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
          ]
        });
      });
    });

    it("should compute state with empty events", () => {
      return computeCommunityState([]).then(state => {
        expect(state).to.deep.equal({});
      });
    });

    it("should not compute state with unknown event", () => {
      return computeCommunityState([communityUnknownEvent]).catch(error => {
        expect(error).to.deep.equal({
          message: "Unknown community event"
        });
      });
    });

  });
});
