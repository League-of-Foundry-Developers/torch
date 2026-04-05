import assert from "assert";
import SourceLibrary from "../src/library.mjs";

describe("Torch Library Tests >", () => {
  describe("library.applyFieldDefaults() tests >", () => {
    // `applyFieldDefaults(lib, ref)` allows for defaulting the values of fields, allowing source and user libraries to be more succinct.
    // It is called with a single parameter when the system-supplied library of sources is statically loaded.
    // It is called with two parameters when the user-supplied library is loaded, using the system-supplied library as a reference.
    // In either case, it is the library supplied as the first parameter only that is adjusted with the defaults.

    it("applyFieldDefaults(systemLib) - defaults are all applied", () => {
      /* eslint-disable prettier/prettier */
      let lib = {
        fakeSystem: {
          sources: {
            nuke: { light: { bright: 5, dim: 10, angle: 360 } },
            other: { light: [{ bright: 10, dim: 20, angle: 360 }] },
          },
          aliases: { bomb: "nuke", alt: "other" },
        },
      };
      let expectedSystem = {
        system: "fakeSystem",
        topology: "standard",
        quantity: "quantity",
        sources: {
          nuke: {
            name: "nuke",
            type: "equipment",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 5, dim: 10, angle: 360 }],
          },
          other: {
            name: "other",
            type: "equipment",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 10, dim: 20, angle: 360 }],
          },
          bomb: {
            name: "bomb",
            type: "equipment",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 5, dim: 10, angle: 360 }],
          },
          alt: {
            name: "alt",
            type: "equipment",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 10, dim: 20, angle: 360 }],
          },
        },
        aliases: { bomb: "nuke", alt: "other" },
      };
      /* eslint-enable prettier/prettier */
      SourceLibrary.applyFieldDefaults(lib);
      assert.deepEqual(lib["fakeSystem"], expectedSystem);
    });
    // If value is missing from user-defined library, values from reference library are used if present.
    // If not, system-wide defaults are used.
    // Because defaults are applied to the reference library, in theory, the latter should only happen for systems that don't appear in the reference library.
    // In this tests, "nuke" is the source that only appears in the user library, while "other" appears in both.
    // The user library creates "crazy" from the system library's "special" because of the alias, but special is not added to the user library.
    it("applyFieldDefaults(userLib, systemLib) - defaults are all applied", () => {
      /* eslint-disable prettier/prettier */
      let lib = {
        fakeSystem: {
          sources: {
            nuke: { light: { bright: 5, dim: 10, angle: 360 } },
            other: { light: [{ bright: 10, dim: 20, angle: 360 }] },
          },
          aliases: { crazy: "special" },
        },
      };
      let ref = {
        fakeSystem: {
          topology: "gurps",
          quantity: "amount",
          sources: {
            other: {
              type: "spell",
              consumable: true,
              states: 2,
              light: [{ bright: 15, dim: 30, angle: 57 }],
            },
            special: {
              type: "equipment",
              consumable: false,
              states: 2,
              light: [{ bright: 20, dim: 35, angle: 90 }],
            },
          },
        },
      };
      let expectedSystem = {
        system: "fakeSystem",
        topology: "gurps",
        quantity: "amount",
        sources: {
          nuke: {
            name: "nuke",
            type: "equipment",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 5, dim: 10, angle: 360 }],
          },
          other: {
            name: "other",
            type: "spell",
            consumable: true,
            duration: 0,
            states: 2,
            light: [{ bright: 10, dim: 20, angle: 360 }],
          },
          crazy: {
            name: "crazy",
            type: "equipment",
            consumable: false,
            states: 2,
            light: [{ bright: 20, dim: 35, angle: 90 }],
          },
        },
        aliases: { crazy: "special" },
      };
      /* eslint-enable prettier/prettier */
      SourceLibrary.applyFieldDefaults(lib, ref);
      assert.deepEqual(lib["fakeSystem"], expectedSystem);
    });
    it("applyFieldDefaults(systemLib) - defaults do not override actual data", () => {
      /* eslint-disable prettier/prettier */
      let lib = {
        fakeSystem: {
          system: "aSystem", // While this test shows it is permitted, it isn't wise to change the system property to not match the key.
          topology: "gurps",
          quantity: "count",
          sources: {
            nuke: {
              name: "Nuke2",
              type: "spell",
              consumable: true,
              states: 3,
              light: [
                { bright: 15, dim: 20, angle: 360 },
                { bright: 20, dim: 40, angle: 57 },
              ],
            },
            other: {
              name: "Other",
              type: "spell",
              consumable: false,
              states: 2,
              light: [{ bright: 10, dim: 20, angle: 360 }],
            },
          },
        },
      };
      let expectedSystem = {
        system: "aSystem",
        topology: "gurps",
        quantity: "count",
        sources: {
          nuke: {
            name: "Nuke2",
            type: "spell",
            consumable: true,
            duration: 0,
            states: 3,
            light: [
              { bright: 15, dim: 20, angle: 360 },
              { bright: 20, dim: 40, angle: 57 },
            ],
          },
          other: {
            name: "Other",
            type: "spell",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 10, dim: 20, angle: 360 }],
          },
        },
      };
      /* eslint-enable prettier/prettier */
      SourceLibrary.applyFieldDefaults(lib);
      assert.deepEqual(lib["fakeSystem"], expectedSystem);
    });
    // This also tests that data from the reference library also does not override data from the supplied library
    it("applyFieldDefaults(userlib, systemLib) - defaults do not override actual data", () => {
      /* eslint-disable prettier/prettier */
      let lib = {
        fakeSystem: {
          system: "aSystem",
          topology: "gurps",
          quantity: "count",
          sources: {
            nuke: {
              name: "Nuke2",
              type: "spell",
              consumable: "true",
              states: 3,
              light: [
                { bright: 15, dim: 20, angle: 360 },
                { bright: 20, dim: 40, angle: 57 },
              ],
            },
            other: {
              name: "Other",
              type: "spell",
              consumable: "false",
              states: 2,
              light: [{ bright: 10, dim: 20, angle: 360 }],
            },
          },
        },
      };
      let ref = {
        fakeSystem: {
          topology: "gurps",
          quantity: "amount",
          sources: {
            other: {
              type: "spell",
              consumable: true,
              states: 2,
              light: [{ bright: 15, dim: 30, angle: 57 }],
            },
          },
        },
      };
      let expectedSystem = {
        system: "aSystem",
        topology: "gurps",
        quantity: "count",
        sources: {
          nuke: {
            name: "Nuke2",
            type: "spell",
            consumable: true,
            duration: 0,
            states: 3,
            light: [
              { bright: 15, dim: 20, angle: 360 },
              { bright: 20, dim: 40, angle: 57 },
            ],
          },
          other: {
            name: "Other",
            type: "spell",
            consumable: false,
            duration: 0,
            states: 2,
            light: [{ bright: 10, dim: 20, angle: 360 }],
          },
        },
      };
      /* eslint-enable prettier/prettier */
      SourceLibrary.applyFieldDefaults(lib, ref);
      assert.deepEqual(lib["fakeSystem"], expectedSystem);
    });
  });

  /* eslint-disable prettier/prettier */
  const testLights = {
    dnd5e: {
      sources: {
        "Phantom Torch": {
          consumable: true,
          light: {
            bright: 5,
            dim: 20,
            angle: 360,
            color: "#ff9329",
            alpha: 0.6,
          },
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

  describe("library.load() tests >", () => {
    beforeEach(function () {});
    afterEach(function () {
      SourceLibrary.commonLibrary = undefined;
    });
    it("library load for D&D 5e without a user library", async () => {
      assert.equal(
        SourceLibrary.commonLibrary,
        undefined,
        "no common library loaded initially",
      );
      let library = await SourceLibrary.load("dnd5e", 10, 50, "Torch");
      assert.ok(SourceLibrary.commonLibrary, "common library loaded");
      let candle = library.getLightSource("candle");
      assert.deepEqual(
        candle.light[0],
        { bright: 5, dim: 10, angle: 360 },
        "candle from common came in correctly",
      );
      let torch = library.getLightSource("torch");
      assert.deepEqual(
        torch.light[0],
        { bright: 20, dim: 40, angle: 360 },
        "torch brightness came in from library not from fallback",
      );
      let phantom = library.getLightSource("phantom torch");
      assert.equal(phantom, undefined, "No phantom torch defined as expected");
    });
    it("library load for D&D 5e with no user inventory item set", async () => {
      assert.equal(
        SourceLibrary.commonLibrary,
        undefined,
        "no common library loaded initially",
      );
      let library = await SourceLibrary.load("dnd5e", 50, 10, undefined);
      assert.ok(SourceLibrary.commonLibrary, "common library loaded");
      let candle = library.getLightSource("candle");
      assert.deepEqual(
        candle.light[0],
        { bright: 5, dim: 10, angle: 360 },
        "candle from common came in correctly",
      );
      let torch = library.getLightSource("torch");
      assert.deepEqual(
        torch.light[0],
        { bright: 20, dim: 40, angle: 360 },
        "torch from common came in correctly",
      );
    });
    it("library load for D&D 5e with a user library", async () => {
      assert.equal(
        SourceLibrary.commonLibrary,
        undefined,
        "no common library loaded initially",
      );
      /* eslint-disable-next-line prettier/prettier */
      let library = await SourceLibrary.load(
        "dnd5e",
        10,
        50,
        "Torch",
        testLights,
      );
      assert.ok(SourceLibrary.commonLibrary, "common library loaded");
      let torch = library.getLightSource("torch");
      assert.deepEqual(
        torch.light[0],
        { bright: 20, dim: 40, angle: 360 },
        "torch brightness came in from library not from fallback",
      );
      let candle = library.getLightSource("candle");
      assert.deepEqual(
        candle.light[0],
        /* eslint-disable-next-line prettier/prettier */
        {
          bright: 10,
          dim: 15,
          angle: 360,
          color: "#ff9329",
          alpha: 0.5,
          animation: { type: "torch", speed: 5, intensity: 5, reverse: false },
        },
        "candle from user library came in correctly",
      );
      let phantom = library.getLightSource("phantom torch");
      assert.ok(phantom, "The phantom torch light source exists in the data");
      assert.deepEqual(
        phantom.light[0],
        { bright: 5, dim: 20, angle: 360, color: "#ff9329", alpha: 0.6 },
        "phantom from user library came in correctly",
      );
    });
    it("library load for GURPS with a user library with a GURPS flashlight", async () => {
      assert.equal(
        SourceLibrary.commonLibrary,
        undefined,
        "no common library loaded initially",
      );
      let library = await SourceLibrary.load(
        "test",
        50,
        10,
        "Torch",
        testLights,
      );
      assert.ok(SourceLibrary.commonLibrary, "common library loaded");
      let candle = library.getLightSource("candle");
      assert.equal(candle, undefined, "No candle defined as expected");
      let selfSource = library.getLightSource("self");
      assert.equal(
        selfSource,
        undefined,
        "No self light source defined as expected",
      );
      let flashlight = library.getLightSource("flashlight");
      assert.ok(flashlight, "Flashlight defined as expected");
      assert.deepEqual(
        flashlight.light[0],
        { bright: 10, dim: 0, angle: 3, color: "#ffd6aa", alpha: 1.0 },
        "user flashlight light settings match",
      );
    });
    it("library load for an unspecified system without a user library", async () => {
      assert.equal(
        SourceLibrary.commonLibrary,
        undefined,
        "no common library loaded initially",
      );
      let library = await SourceLibrary.load("unspecified", 10, 50, "Torch");
      assert.ok(SourceLibrary.commonLibrary, "common library loaded");
      let torch = library.getLightSource("torch");
      assert.deepEqual(
        torch.light[0],
        { bright: 10, dim: 50, angle: 360 },
        "torch brightness came in from the fallback settings",
      );
      let candle = library.getLightSource("candle");
      assert.equal(candle, undefined, "No phantom torch defined as expected");
      let phantom = library.getLightSource("phantom torch");
      assert.equal(phantom, undefined, "No phantom torch defined as expected");
    });
  });
});
