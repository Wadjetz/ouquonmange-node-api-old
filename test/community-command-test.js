const describe = require("mocha/lib/mocha").describe;
const it = require("mocha/lib/mocha").it;
const expect = require("chai").expect;
const computeCommunityCommand = require("../src/event-sourcing/community-command");
const communityEvents = require("../src/event-sourcing/community-constants").events;
const communityCommands = require("../src/event-sourcing/community-constants").commands;

const createCommand = {
  type: communityCommands.community_create,
  data: {
    name: "Ouquonmange Team",
    user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
  }
};

const addUserCommand = {
  type: communityCommands.community_add_user,
  data: {
    community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
    user_id: "bda484c3-f9b0-44cf-899e-63cd59abe1c3"
  }
};

const alreadyAddedCommand = {
  domain: "community",
  type: communityCommands.community_add_user,
  data: {
    community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
    user_id: "2a6983fd-9137-4b19-b651-7c22e21506df"
  }
};

const state = {
  name: "Ouquonmange Team",
  community_id: "d7d08a44-1b49-4b8c-96f8-67b7385a2a66",
  users: [
    "2a6983fd-9137-4b19-b651-7c22e21506df"
  ]
};

describe("Community command", () => {
  describe("Compute community command", () => {

    it("should compute community create command", () => {
      return computeCommunityCommand(createCommand, {}).then(events => {
        expect(events.length).to.equal(2);
        expect(events[0].event_type).to.equal(communityEvents.community_created);
        expect(events[0].name).to.equal("Ouquonmange Team");
        expect(events[1].event_type).to.equal(communityEvents.community_user_added);
        expect(events[1].user_id).to.equal("bda484c3-f9b0-44cf-899e-63cd59abe1c3");
      });
    });

    it("should compute community add user command", () => {
      return computeCommunityCommand(addUserCommand, state).then(events => {
        expect(events.length).to.equal(1);
        expect(events[0].event_type).to.equal(communityEvents.community_user_added);
        expect(events[0].user_id).to.equal("bda484c3-f9b0-44cf-899e-63cd59abe1c3");
      });
    });

    it("should not compute community add user command with user already added", () => {
      return computeCommunityCommand(alreadyAddedCommand, state).catch(error => {
        expect(error).to.deep.equal({
          message: "2a6983fd-9137-4b19-b651-7c22e21506df user already added"
        });
      });
    });

  });
});
