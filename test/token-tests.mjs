import assert from "assert";
import TorchToken from "../src/token.mjs";
import SourceLibrary from "../src/library.mjs";
import { MockItem, MockActor, MockToken, MockGame } from "./test-stubs.mjs";

describe("Torch Token Tests >", () => {
  describe("Token tests for D&D5e actors, scene, and tokens >", () => {
    afterEach(async () => {
      SourceLibrary.commonLibrary = undefined;
      globalThis.game = undefined;
    });

    it("Light source selection", async () => {
      // Set up data
      let actor = new MockActor(
        "1234567",
        "Versatile",
        [new MockItem("Torch", 1), new MockItem("Hooded Lantern")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, {
        gmInventoryItemName: "Other",
        gmUsesInventory: true,
        playerUsesInventory: true,
      });
      let library = await SourceLibrary.load("dnd5e", 10, 20);
      // Perform test
      let token = new TorchToken(new MockToken(actor, "Torch"), library);
      let sources = token.ownedLightSources;
      let currentSource = token.currentLightSource;
      assert.ok(sources, "Owned light sources came back in one piece");
      assert.ok(currentSource, "The token has a current source");
      assert.strictEqual(
        sources.length,
        2,
        "Exactly as many owned light sources came back as expected",
      );
    });

    it("Light source selection - ignore equipment", async () => {
      // Set up data
      let actor = new MockActor(
        "1234567",
        "Versatile",
        [new MockItem("Torch", 1), new MockItem("Hooded Lantern")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, {
        gmInventoryItemName: "Other",
        gmUsesInventory: true,
        playerUsesInventory: true,
      });
      let library = await SourceLibrary.load(
        "dnd5e",
        10,
        20,
        undefined,
        undefined,
        undefined,
        true,
      );
      // Perform test
      let token = new TorchToken(new MockToken(actor, "Torch"), library);
      let sources = token.ownedLightSources;
      let currentSource = token.currentLightSource;
      assert.ok(sources, "Owned light sources came back in one piece");
      assert.ok(currentSource, "The token has a current source");
      assert.strictEqual(
        sources.length,
        18,
        "All the light sources came back as owned",
      );
    });

    it("Cycle of token states - torch", async () => {
      // Set up data
      let actor = new MockActor(
        "1234567",
        "Versatile",
        [new MockItem("Torch", 1), new MockItem("Hooded Lantern")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, {
        gmInventoryItemName: "Other",
        gmUsesInventory: true,
        playerUsesInventory: true,
      });
      let library = await SourceLibrary.load("dnd5e", 10, 20);
      // Perform test
      let token = new TorchToken(
        new MockToken(actor, "HoodedLantern"),
        library,
      );
      await token.setCurrentLightSource("Torch");
      let exhausted = token.lightSourceIsExhausted("Torch");
      assert.equal(exhausted, false, "Torches are not exhausted when we start");
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Token is initially off",
      );
      await token.forceStateOff();
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Token is off when forced to be off when it already is",
      );
      exhausted = token.lightSourceIsExhausted("Torch");
      assert.equal(
        exhausted,
        false,
        "Torches are not exhausted after initially forcing off from off",
      );
      await token.advanceState();
      assert.equal(token.lightSourceState, token.STATE_ON, "Token is on");
      await token.advanceState();
      assert.equal(token.lightSourceState, token.STATE_OFF, "Token is off");
      exhausted = token.lightSourceIsExhausted("Torch");
      assert.equal(exhausted, true, "Torches are exhausted when we're done");
    });

    it("Cycle of token states - hooded lantern", async () => {
      // Set up data
      let actor = new MockActor(
        "1234567",
        "Versatile",
        [new MockItem("Torch", 1), new MockItem("Hooded Lantern")],
        15,
        30,
      );
      globalThis.game = new MockGame("dnd5e", [actor], false, {
        gmInventoryItemName: "Other",
        gmUsesInventory: true,
        playerUsesInventory: true,
      });
      let library = await SourceLibrary.load("dnd5e", 10, 20);
      // Perform test
      let token = new TorchToken(new MockToken(actor, "Torch"), library);
      await token.forceStateOff();
      assert.equal(token.lightSourceState, token.STATE_OFF, "Token is off");
      await token.setCurrentLightSource("Hooded Lantern");
      let exhausted = token.lightSourceIsExhausted("Hooded Lantern");
      assert.equal(
        exhausted,
        false,
        "Hooded Lanterns are not exhausted when we start",
      );
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Hooded lantern is initially off",
      );
      await token.advanceState();
      assert.equal(
        token.lightSourceState,
        token.STATE_ON,
        "Token is on after first advancement",
      );
      await token.advanceState();
      assert.equal(
        token.lightSourceState,
        token.STATE_DIM,
        "Token is dim after second advancement",
      );
      await token.advanceState();
      assert.equal(
        token.lightSourceState,
        token.STATE_OFF,
        "Token is off after third advancement",
      );
      exhausted = token.lightSourceIsExhausted("Hooded Lantern");
      assert.equal(
        exhausted,
        false,
        "Hooded Lanterns are not exhausted when we're done either",
      );
    });
  });
});
