import assert from "assert";
import { MockActor, MockItem } from "./test-stubs.mjs";
import SourceLibrary from "../src/library.mjs";

/* eslint-disable prettier/prettier */
const testLights = {
  dnd5e: {
    sources: {
      "Phantom Torch": {
        consumable: true,
        light: { bright: 5, dim: 20, angle: 360, color: "#ff9329", alpha: 0.6 },
      },
      Candle: {
        consumable: true,
        light: [
          {
            bright: 10,
            dim: 15,
            angle: 360,
            color: "#ff9329",
            alpha: 0.5,
            animation: {
              type: "torch",
              speed: 5,
              intensity: 5,
              reverse: false,
            },
          },
        ],
      },
    },
  },
  test: {
    topology: "gurps",
    sources: {
      Flashlight: {
        light: { bright: 10, dim: 0, angle: 3, color: "#ffd6aa", alpha: 1.0 },
      },
    },
  },
};
/* eslint-enable prettier/prettier */

describe("Topology Tests >", () => {
  describe("Standard library topology test >", () => {
    it("Actor inventory settings for Versatile in D&D5e with a user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load(
        "dnd5e",
        50,
        10,
        "Torch",
        testLights,
      );
      let versatile = {
        items: [
          new MockItem("Torch", 5),
          new MockItem("Candle", 5),
          new MockItem("Light"),
          new MockItem("Lamp"),
        ],
      };
      let torches = library.getInventory(versatile, "Torch");
      assert.ok(
        typeof torches === "number",
        "Count of torches has a numeric value",
      );
      let candles = library.getInventory(versatile, "Candle");
      assert.ok(
        typeof candles === "number",
        "Count of candles has a numeric value",
      );
      let lights = library.getInventory(versatile, "Light");
      assert.ok(
        typeof lights === "undefined",
        "Light cantrip doesn't have inventory",
      );
      let lamps = library.getInventory(versatile, "Lamp");
      assert.ok(typeof lamps === "undefined", "Lamp doesn't have inventory");
      await library._presetInventory(versatile, "Torch", 2);
      let before = library.getInventory(versatile, "Torch");
      await library.decrementInventory(versatile, "Torch");
      let afterFirst = library.getInventory(versatile, "Torch");
      await library.decrementInventory(versatile, "Torch");
      let afterSecond = library.getInventory(versatile, "Torch");
      await library.decrementInventory(versatile, "Torch");
      let afterThird = library.getInventory(versatile, "Torch");
      assert.equal(before, 2, "Started with set value");
      assert.equal(afterFirst, 1, "Decremented to one");
      assert.equal(afterSecond, 0, "Decremented to zero");
      assert.equal(afterThird, 0, "Remained at zero");
    });
    it("Actor image settings for Versatile in D&D5e with a user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load(
        "dnd5e",
        50,
        10,
        "Torch",
        testLights,
      );
      let versatile = {
        items: [
          new MockItem("Torch", 5),
          new MockItem("Candle", 5),
          new MockItem("Light"),
          new MockItem("Lamp"),
        ],
      };
      let torchImage = library.getImage(versatile, "Torch");
      assert.ok(torchImage, "Torch should have a defined image");
      assert.notEqual(torchImage, "", "Torch image has a reasonable value");
      let candleImage = library.getImage(versatile, "Candle");
      assert.ok(candleImage, "Candle should have a defined image");
      assert.notEqual(candleImage, "", "Candle image has a reasonable value");
      let lampImage = library.getImage(versatile, "Lamp");
      assert.ok(lampImage, "Lamp should have a defined image");
      assert.notEqual(lampImage, "", "Lamp image has a reasonable value");
      let lightImage = library.getImage(versatile, "Light");
      assert.ok(lightImage, "Light cantrip should have a defined image");
      assert.notEqual(
        lightImage,
        "",
        "Light cantrip image has a reasonable value",
      );
    });

    it("Actor light sources for Lightbearer, Breaker, Empty, and Bic in D&D5e with a user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load(
        "dnd5e",
        50,
        10,
        "Torch",
        testLights,
      );

      let breaker = {
        items: [new MockItem("Torch"), new MockItem("Dancing Lights")],
      };
      let breakerSources = library.actorLightSources(breaker);
      assert.equal(
        breakerSources.length,
        2,
        "Breaker has two known light sources",
      );
      assert.notEqual(
        breakerSources[0].name,
        breakerSources[1].name,
        "Breaker's sources are different",
      );
      assert.ok(
        ["Torch", "Dancing Lights"].includes(breakerSources[0].name),
        "Breaker's first source is expected",
      );
      assert.ok(
        ["Torch", "Dancing Lights"].includes(breakerSources[1].name),
        "Breaker's second source is expected",
      );
      assert.equal(
        library.actorHasLightSource(breaker, "Dancing Lights"),
        true,
        "Breaker is reported as having Dancing Lights",
      );

      let bearer = { items: [new MockItem("Torch", 5)] };
      let bearerSources = library.actorLightSources(bearer);
      assert.equal(
        bearerSources.length,
        1,
        "Torchbearer has precisely one light source",
      );
      assert.equal(
        bearerSources[0].name,
        "Torch",
        "Torchbearer's light source is Torch, as eqpected",
      );
      assert.equal(
        library.actorHasLightSource(bearer, "Torch"),
        true,
        "Bearer is reported as having the Torch light source",
      );

      let empty = { items: [] };
      let emptySources = library.actorLightSources(empty);
      assert.equal(
        emptySources.length,
        0,
        "Empty truly has no known light sources",
      );
      assert.equal(
        library.actorHasLightSource(empty, "Candle"),
        false,
        "Empty is reported as not having the candle light source",
      );

      let everythingBut = {
        items: [
          new MockItem("Flashlight"),
          new MockItem("Blowtorch", 5),
          new MockItem("Magical Floodlight"),
        ],
      };
      let everythingButSources = library.actorLightSources(everythingBut);
      assert.equal(
        everythingButSources.length,
        0,
        "Bic has no known light sources, even though it has ways of casting light",
      );
      assert.equal(
        library.actorHasLightSource(everythingBut, "Candle"),
        false,
        "Empty is reported as not having the candle light source",
      );
    });
  });
  /* eslint-disable prettier/prettier */
  const MiniFlashlightGURPSSource = {
    image: "/icons/svg/light.svg",
    name: "Mini Flashlight",
    type: "equipment",
    consumable: false,
    duration: 0,
    states: 2,
    light: {
      0: { bright: 4, dim: 5, angle: 6, color: "#ffd6aa", alpha: 1 },
    },
  };
  const TorchGURPSSource = {
    image: "/icons/svg/light.svg",
    name: "Torch",
    type: "equipment",
    consumable: true,
    duration: 0,
    states: 2,
    light: {
      0: { bright: 9, dim: 10, angle: 360, color: "#ff9329", alpha: 1 },
    },
  };
  /* eslint-enable prettier/prettier */

  describe("GURPS Library topology test >", () => {
    beforeEach(function () {});
    afterEach(function () {
      SourceLibrary.commonLibrary = undefined;
    });

    it("Actor light sources for Theodore in GURPS with no user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load("gurps", 50, 10, undefined);
      let items = [new MockItem("Mini Flashlight"), new MockItem("Torch")];
      let theodore = new MockActor("12345", "Theodore", items, 20, 40);
      theodore.findEquipmentByNameMethod = (name) => {
        switch (name) {
          case "Mini Flashlight":
            return [theodore.items[0], "F"];
          case "Torch":
            return [theodore.items[1], "T"];
          default:
            return [undefined, undefined];
        }
      };
      let theodoreSources = library.actorLightSources(theodore);
      assert.deepEqual(
        theodoreSources,
        [MiniFlashlightGURPSSource, TorchGURPSSource],
        "Theodore has the expected set of sources",
      );
      assert.equal(
        library.actorHasLightSource(theodore, "Torch"),
        true,
        "Theodore has a torch",
      );
    });
    it("Actor inventory and image settings for Theodore in GURPS with a user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load("gurps", 50, 10, undefined);
      let items = [new MockItem("Mini Flashlight"), new MockItem("Torch")];
      let theodore = new MockActor("12345", "Theodore", items, 20, 40);
      theodore.findEquipmentByNameMethod = (name) => {
        switch (name) {
          case "Mini Flashlight":
            return [theodore.items[0], "F"];
          case "Torch":
            return [theodore.items[1], "T"];
          default:
            return [undefined, undefined];
        }
      };
      theodore.updateEqtCountDataMethod = (key, value) => {
        switch (key) {
          case "F":
            theodore.items[0].count = value;
            break;
          case "T":
            theodore.items[1].count = value;
            break;
          default:
            assert.fail(
              "Updated equipment count of somethign Theodore doesn't have",
            );
        }
      };
      items[1].count = 5;
      let torches = library.getInventory(theodore, "Torch");
      assert.ok(
        typeof torches === "number",
        "Count of torches has a numeric value",
      );
      await library._presetInventory(theodore, "Torch", 2);
      let before = library.getInventory(theodore, "Torch");
      await library.decrementInventory(theodore, "Torch");
      let afterFirst = library.getInventory(theodore, "Torch");
      await library.decrementInventory(theodore, "Torch");
      let afterSecond = library.getInventory(theodore, "Torch");
      await library.decrementInventory(theodore, "Torch");
      let afterThird = library.getInventory(theodore, "Torch");
      assert.equal(before, 2, "Started with set value");
      assert.equal(afterFirst, 1, "Decremented to one");
      assert.equal(afterSecond, 0, "Decremented to zero");
      assert.equal(afterThird, 0, "Remained at zero");

      let torchImage = library.getImage(theodore, "Torch");
      assert.ok(torchImage, "Torch should have a defined image");
      assert.notEqual(torchImage, "", "Torch image has a reasonable value");
    });
  });
  describe("Default Library topology test >", () => {
    beforeEach(function () {});
    afterEach(function () {
      SourceLibrary.commonLibrary = undefined;
    });
    it("Actor light sources for Enigma in random system with no user library", async () => {
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load("random", 10, 50, undefined);
      let items = [new MockItem("Mini Flashlight"), new MockItem("Torch")];
      let enigma = new MockActor("12345", "Enigma", items, 20, 40);
      let sources = library.actorLightSources(enigma);
      assert.deepEqual(
        sources,
        [
          {
            name: "Self",
            type: "none",
            consumable: false,
            duration: 0,
            image: "/icons/svg/light.svg",
            states: 2,
            light: {
              0: { angle: 360, bright: 10, dim: 50 },
            },
          },
        ],
        "Enigma has the expected set of sources",
      );
      assert.equal(
        library.actorHasLightSource(enigma, "Self"),
        true,
        "Enigma has himself",
      );
      assert.equal(
        library.actorHasLightSource(enigma, "Other"),
        false,
        "Enigma has no other",
      );
      assert.strictEqual(
        1,
        library.getInventory(enigma, "Self"),
        "Enigma has only one self",
      );
    });
  });
});
