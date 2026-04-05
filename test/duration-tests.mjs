import assert from "assert";
import TorchToken from "../src/token.mjs";
import SourceLibrary from "../src/library.mjs";
import { MockItem, MockActor, MockToken, MockGame } from "./test-stubs.mjs";

/*
 * User library that provides a source with no duration,
 * so we can test both paths (with/without duration).
 */
/* eslint-disable prettier/prettier */
const testLightsNoDuration = {
  dnd5e: {
    sources: {
      "Magical Lamp": {
        consumable: false,
        light: { bright: 20, dim: 40, angle: 360 },
      },
    },
  },
};
/* eslint-enable prettier/prettier */

const ALL_SETTINGS = {
  fallbackBrightRadius: 10,
  fallbackDimRadius: 20,
  fallbackSourceName: "Torch",
  gameLightSources: "",
  ignoreEquipment: false,
  gmUsesInventory: true,
  playerUsesInventory: true,
  debugLogging: false,
  durationWarningThreshold: 0.9,
};

describe("Duration Tests >", () => {
  describe("Token duration flag management >", () => {
    afterEach(() => {
      SourceLibrary.commonLibrary = undefined;
      globalThis.game = undefined;
    });

    it("Turning on a source with duration sets duration flags", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 1000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      await token.advanceState();

      assert.equal(
        token.lightSourceState,
        token.STATE_ON,
        "Token is on after advance",
      );
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        1000,
        "litAt set to current worldTime",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        1000 + 60 * 60,
        "expiresAt = worldTime + duration in seconds",
      );
      assert.equal(
        mockToken.getFlag("torch", "warnAt"),
        1000 + Math.floor(60 * 60 * 0.9),
        "warnAt at 90% of duration",
      );
      assert.strictEqual(
        mockToken.getFlag("torch", "durationWarned"),
        false,
        "durationWarned starts false",
      );
    });

    it("Turning on a source without duration sets no duration flags", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Magical Lamp")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 500;

      let library = await SourceLibrary.load(
        "dnd5e",
        10,
        20,
        undefined,
        testLightsNoDuration,
      );
      let mockToken = new MockToken(actor, "Magical Lamp");
      let token = new TorchToken(mockToken, library);

      await token.advanceState();

      assert.equal(token.lightSourceState, token.STATE_ON, "Token is on");
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        undefined,
        "No litAt for durationless source",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        undefined,
        "No expiresAt for durationless source",
      );
    });

    it("Turning off a source clears duration flags", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 2000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      // Turn on (sets flags), then turn off (should clear them)
      await token.advanceState(); // OFF → ON
      assert.ok(
        mockToken.getFlag("torch", "litAt") !== undefined,
        "litAt set after turn on",
      );

      await token.advanceState(); // ON → OFF
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Token is off after second advance",
      );
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        undefined,
        "litAt cleared after turn off",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        undefined,
        "expiresAt cleared after turn off",
      );
      assert.equal(
        mockToken.getFlag("torch", "warnAt"),
        undefined,
        "warnAt cleared after turn off",
      );
      assert.equal(
        mockToken.getFlag("torch", "durationWarned"),
        undefined,
        "durationWarned cleared after turn off",
      );
    });

    it("forceStateOff clears duration flags", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 3000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      await token.advanceState(); // OFF → ON
      assert.ok(
        mockToken.getFlag("torch", "expiresAt") !== undefined,
        "expiresAt set after turn on",
      );

      await token.forceStateOff();
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Token is off after forceStateOff",
      );
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        undefined,
        "litAt cleared after forceStateOff",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        undefined,
        "expiresAt cleared after forceStateOff",
      );
    });

    it("remainingDuration returns minutes remaining for active source", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 1000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      await token.advanceState(); // OFF → ON, litAt=1000, expiresAt=4600

      // Simulate 30 minutes passing
      globalThis.game.time.worldTime = 1000 + 30 * 60;
      let remaining = token.remainingDuration();
      assert.equal(remaining, 30, "30 minutes remaining after 30 minutes");

      // Simulate 59 minutes passing
      globalThis.game.time.worldTime = 1000 + 59 * 60;
      remaining = token.remainingDuration();
      assert.equal(remaining, 1, "1 minute remaining after 59 minutes");

      // Simulate full duration elapsed
      globalThis.game.time.worldTime = 1000 + 60 * 60;
      remaining = token.remainingDuration();
      assert.equal(remaining, 0, "0 minutes remaining when expired");
    });

    it("remainingDuration returns null for infinite source", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Magical Lamp")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);

      let library = await SourceLibrary.load(
        "dnd5e",
        10,
        20,
        undefined,
        testLightsNoDuration,
      );
      let mockToken = new MockToken(actor, "Magical Lamp");
      let token = new TorchToken(mockToken, library);

      await token.advanceState();
      let remaining = token.remainingDuration();
      assert.equal(remaining, null, "null for source without duration");
    });

    it("remainingDuration returns null when source is not lit", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      let remaining = token.remainingDuration();
      assert.equal(remaining, null, "null when source is not lit");
    });

    it("3-state source: flags set on ON, persist through DIM, cleared on OFF", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Hooded Lantern")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 5000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Hooded Lantern");
      let token = new TorchToken(mockToken, library);

      // OFF → ON: duration flags should be set
      await token.advanceState();
      assert.equal(token.lightSourceState, token.STATE_ON, "Lantern is on");
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        5000,
        "litAt set on turn on",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        5000 + 360 * 60,
        "expiresAt for 360-min lantern",
      );

      // ON → DIM: duration flags should persist
      await token.advanceState();
      assert.equal(token.lightSourceState, token.STATE_DIM, "Lantern is dim");
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        5000,
        "litAt persists through dim",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        5000 + 360 * 60,
        "expiresAt persists through dim",
      );

      // DIM → OFF: duration flags should be cleared
      await token.advanceState();
      assert.equal(token.lightSourceState, token.STATE_OFF, "Lantern is off");
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        undefined,
        "litAt cleared on turn off",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        undefined,
        "expiresAt cleared on turn off",
      );
    });

    it("Re-lighting resets duration flags to new worldTime", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, ALL_SETTINGS);
      globalThis.game.time.worldTime = 1000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      await token.advanceState(); // OFF → ON at time 1000
      assert.equal(mockToken.getFlag("torch", "litAt"), 1000, "First litAt");

      await token.advanceState(); // ON → OFF (clears flags)

      // Advance time and re-light
      globalThis.game.time.worldTime = 5000;
      await token.advanceState(); // OFF → ON at time 5000
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        5000,
        "litAt reset to new worldTime",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        5000 + 60 * 60,
        "expiresAt based on new worldTime",
      );
    });

    it("Warning threshold of 0 sets warnAt to 0", async () => {
      let settings = Object.assign({}, ALL_SETTINGS, {
        durationWarningThreshold: 0,
        debugLogging: false,
      });
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, settings);
      globalThis.game.time.worldTime = 1000;

      let library = await SourceLibrary.load("dnd5e", 10, 20);
      let mockToken = new MockToken(actor, "Torch");
      let token = new TorchToken(mockToken, library);

      await token.advanceState();
      assert.equal(
        mockToken.getFlag("torch", "warnAt"),
        0,
        "warnAt is 0 when threshold is 0 (warnings disabled)",
      );
    });
  });

  describe("Duration expiry checking and hooks >", () => {
    let Torch;
    let hookCalls;
    let chatMessages;

    before(async () => {
      // Set up minimal globals needed for torch.mjs module-level code
      // (Hooks registrations and console.log — all safe to stub)
      globalThis.Hooks = {
        on: () => {},
        once: () => {},
        callAll: () => {},
      };
      globalThis.CONST = {
        DOCUMENT_OWNERSHIP_LEVELS: { OWNER: 3 },
      };
      globalThis.ChatMessage = { create: () => {} };
      // Torch.mjs accesses these at module level only during hook callbacks,
      // which never fire in tests, so minimal stubs suffice.
      const mod = await import("../src/torch.mjs");
      Torch = mod.Torch;
    });

    beforeEach(() => {
      hookCalls = [];
      chatMessages = [];
      // Re-wire the mocks to record calls for each test
      globalThis.Hooks.callAll = (name, ...args) => {
        hookCalls.push({ name, args });
      };
      globalThis.ChatMessage.create = (data) => {
        chatMessages.push(data);
      };
    });

    afterEach(() => {
      SourceLibrary.commonLibrary = undefined;
      globalThis.game = undefined;
    });

    function setupExpiryGame(actor, mockToken, worldTime) {
      let game = new MockGame("dnd5e", [actor], true, ALL_SETTINGS);
      game.time.worldTime = worldTime;
      game.scenes = [{ tokens: [mockToken] }];
      game.i18n = { format: (key, data) => `${key}:${JSON.stringify(data)}` };
      game.users = { get: () => ({ active: true }) };
      // Add ownership to actor for getTokenOwnerIds
      actor.ownership = { player1: 3, default: 0 };
      globalThis.game = game;
    }

    it("checkDurations auto-extinguishes an expired source", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      // Simulate a torch lit at time 0, expires at 3600
      mockToken.setFlag("torch", "litAt", 0);
      mockToken.setFlag("torch", "expiresAt", 3600);
      mockToken.setFlag("torch", "warnAt", 3240);
      mockToken.setFlag("torch", "durationWarned", false);

      // World time is past expiry
      setupExpiryGame(actor, mockToken, 3700);

      await Torch.checkDurations(3700);

      assert.equal(
        mockToken.getFlag("torch", "lightSourceState"),
        "off",
        "Token state set to off after expiry",
      );
      assert.equal(
        mockToken.getFlag("torch", "litAt"),
        undefined,
        "litAt cleared after expiry",
      );
      assert.equal(
        mockToken.getFlag("torch", "expiresAt"),
        undefined,
        "expiresAt cleared after expiry",
      );
    });

    it("checkDurations fires torch.expired and torch.changed hooks", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      mockToken.setFlag("torch", "litAt", 0);
      mockToken.setFlag("torch", "expiresAt", 3600);
      mockToken.setFlag("torch", "warnAt", 3240);
      mockToken.setFlag("torch", "durationWarned", false);

      setupExpiryGame(actor, mockToken, 4000);

      await Torch.checkDurations(4000);

      let expiredHooks = hookCalls.filter((h) => h.name === "torch.expired");
      let changedHooks = hookCalls.filter((h) => h.name === "torch.changed");

      assert.equal(
        expiredHooks.length,
        1,
        "torch.expired hook fired exactly once",
      );
      assert.equal(
        expiredHooks[0].args[1],
        "Torch",
        "torch.expired received correct source name",
      );

      assert.equal(
        changedHooks.length,
        1,
        "torch.changed hook fired exactly once",
      );
      assert.equal(
        changedHooks[0].args[1],
        "Torch",
        "torch.changed received correct source name",
      );
      assert.equal(
        changedHooks[0].args[2],
        "off",
        "torch.changed received 'off' state",
      );
    });

    it("checkDurations sends expiry chat message", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      mockToken.setFlag("torch", "litAt", 0);
      mockToken.setFlag("torch", "expiresAt", 3600);
      mockToken.setFlag("torch", "warnAt", 3240);
      mockToken.setFlag("torch", "durationWarned", false);

      setupExpiryGame(actor, mockToken, 3700);

      await Torch.checkDurations(3700);

      assert.equal(chatMessages.length, 1, "One chat message sent on expiry");
      assert.ok(
        chatMessages[0].content.includes("Torch"),
        "Expiry message mentions the source name",
      );
      assert.ok(
        chatMessages[0].whisper.length > 0,
        "Message is whispered to owners",
      );
    });

    it("checkDurations sends warning when past warnAt but before expiry", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      mockToken.setFlag("torch", "litAt", 0);
      mockToken.setFlag("torch", "expiresAt", 3600);
      mockToken.setFlag("torch", "warnAt", 3240);
      mockToken.setFlag("torch", "durationWarned", false);

      // Past warning threshold but not expired
      setupExpiryGame(actor, mockToken, 3300);

      await Torch.checkDurations(3300);

      // Should NOT be extinguished
      assert.equal(
        mockToken.getFlag("torch", "lightSourceState"),
        "on",
        "Token still on after warning",
      );
      // Should be warned
      assert.equal(
        mockToken.getFlag("torch", "durationWarned"),
        true,
        "durationWarned set to true",
      );
      assert.equal(chatMessages.length, 1, "Warning chat message sent");
      // No hooks should fire for warnings
      assert.equal(
        hookCalls.filter((h) => h.name === "torch.expired").length,
        0,
        "No expired hook for warning",
      );
    });

    it("checkDurations does not warn twice", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      mockToken.setFlag("torch", "litAt", 0);
      mockToken.setFlag("torch", "expiresAt", 3600);
      mockToken.setFlag("torch", "warnAt", 3240);
      mockToken.setFlag("torch", "durationWarned", true); // Already warned

      setupExpiryGame(actor, mockToken, 3400);

      await Torch.checkDurations(3400);

      assert.equal(chatMessages.length, 0, "No message when already warned");
    });

    it("checkDurations skips tokens without expiresAt", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "on");
      // No duration flags set — simulates a torch with infinite duration

      setupExpiryGame(actor, mockToken, 99999);

      await Torch.checkDurations(99999);

      assert.equal(
        mockToken.getFlag("torch", "lightSourceState"),
        "on",
        "Token still on — no duration tracking",
      );
      assert.equal(hookCalls.length, 0, "No hooks fired");
      assert.equal(chatMessages.length, 0, "No messages sent");
    });

    it("checkDurations skips tokens that are already off", async () => {
      let actor = new MockActor(
        "1",
        "Tester",
        [new MockItem("Torch", 5)],
        15,
        30,
      );
      let mockToken = new MockToken(actor, "Torch", "off");
      mockToken.setFlag("torch", "expiresAt", 100); // Expired but already off

      setupExpiryGame(actor, mockToken, 99999);

      await Torch.checkDurations(99999);

      assert.equal(hookCalls.length, 0, "No hooks fired for already-off token");
      assert.equal(chatMessages.length, 0, "No messages for already-off token");
    });
  });
});
