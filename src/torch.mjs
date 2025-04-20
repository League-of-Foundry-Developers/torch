import Settings from "./settings.mjs";
import TorchSocket from "./socket.mjs";
import TokenHUD from "./hud.mjs";
import TorchToken from "./token.mjs";
import TorchApi from "./api.mjs";
import SourceLibrary from "./library.mjs";
/* global CONFIG */
/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <shurd@FreeBSD.ORG> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.        Stephen Hurd
 * ----------------------------------------------------------------------------
 */

let DEBUG = true;

let debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};
class Torch {
  /*
   * Add a torch button to the Token HUD - called from TokenHUD render hook
   */
  static async addTorchButton(hud, hudHtml /*, hudData*/) {
    let actor = game.actors.get(hud.object.document.actorId);
    let library = await SourceLibrary.load(
      game.system.id,
      Settings.fallbackLightRadii.bright,
      Settings.fallbackLightRadii.dim,
      Settings.fallbackSourceName,
      Settings.gameLightSources,
      actor.prototypeToken.light,
      Settings.ignoreEquipment,
    );
    let token = new TorchToken(hud.object.document, library);
    let lightSources = token.ownedLightSources;

    // Don't let the tokens we create for light sources have or use their own
    // light sources recursively.
    if (hud.object.document.name in lightSources) return;
    if (!game.user.isGM && !Settings.playerTorches) return;
    if (!token.currentLightSource) {
      TokenHUD.addQueryButton(token, hudHtml);
      return;
    }
    /* Manage torch state */
    TokenHUD.addFlameButton(
      token,
      hudHtml,
      Torch.forceSourceOff,
      Torch.toggleLightSource,
      Torch.toggleLightHeld,
      Torch.changeLightSource,
    );
  }

  static async toggleLightSource(token) {
    let newState = await token.advanceState();
    debugLog(`${token.currentLightSource} is now ${newState}`);
    Hooks.callAll(
      "torch.changed",
      token._token._object,
      token.currentLightSource,
      newState,
    );
  }

  static async forceSourceOff(token) {
    await token.forceSourceOff();
    debugLog(`Forced ${token.currentLightSource} off`);
    Hooks.callAll(
      "torch.changed",
      token._token._object,
      token.currentLightSource,
      "off",
    );
  }

  static async toggleLightHeld(/*token*/) {}

  static async changeLightSource(token, name) {
    await token.setCurrentLightSource(name);
    Hooks.callAll(
      "torch.selected",
      token._token._object,
      token.currentLightSource,
    );
  }

  static setupQuenchTesting() {
    console.log("Torch | --- In test environment - load test code...");
    import("../test/quench/test-hook.mjs")
      .then((obj) => {
        try {
          obj.hookTests();
          console.log("Torch | --- Tests ready");
        } catch (err) {
          console.log("Torch | --- Error registering test code", err);
        }
      })
      .catch((err) => {
        console.log("Torch | --- No test code found", err);
      });
  }
  static grayOutInventorySettings(html, hide, strategy) {
    for (const setting of ["gmUsesInventory", "playerUsesInventory"]) {
      const div =
        strategy === "v13"
          ? html.querySelector(`label[for=settings-config-torch\\.${setting}]`)
              .parentElement
          : html.querySelector(`div[data-setting-id=torch\\.${setting}]`);
      const label = div.querySelector("label");
      const input = div.querySelector("input");
      const p = div.querySelector("p");
      label.classList.toggle("torch-inactive", hide);
      input.toggleAttribute("disabled", hide);
      p.classList.toggle("torch-inactive", hide);
    }
  }
}

Hooks.on("ready", () => {
  Hooks.on("renderTokenHUD", (app, html, data) => {
    Torch.addTorchButton(app, html, data);
  });
  Hooks.on("renderControlsReference", (app, html /*, data*/) => {
    html.find("div").first().append(Settings.helpText);
  });
  game.socket.on("module.torch", (request) => {
    TorchSocket.handleSocketRequest(request);
  });
});

Hooks.on("preUpdateSetting", (doc, changes) => {
  if (doc.key === "torch.gameLightSources") {
    let cleanedValue = changes.value;
    if (changes.value.substring(0,1) === '"') {
      cleanedValue = changes.value.substring(1, changes.value.length - 1);
    }
    SourceLibrary.validateSourceJSON(cleanedValue, true);
  }
});

Hooks.on("renderSettingsConfig", (app, hudHtml) => {
  // Set up grayed settings based on ignoreEquipment at time of render
  const html = hudHtml.querySelector ? hudHtml : hudHtml[0];
  let strategy = "v12";
  let elem = html.querySelector(
    `div[data-setting-id="torch.ignoreEquipment"] input`,
  );
  if (!elem) {
    strategy = "v13";
    elem = html.querySelector(
      `input[id=settings-config-torch\\.ignoreEquipment]`,
    );
  }
  if (elem) {
    Torch.grayOutInventorySettings(html, elem.checked, strategy);
    // Change what is grayed as the user changes settings
    const ignoreEquipmentChangeListener = (event) => {
      Torch.grayOutInventorySettings(html, event.target.checked, strategy);
    };
    elem.addEventListener("change", ignoreEquipmentChangeListener);
  }
});

Hooks.once("init", () => {
  // Only load and initialize test suite if we're in a test environment
  if (game.world.id.startsWith("torch-test-")) {
    Torch.setupQuenchTesting();
  }
  Settings.register();
  game.Torch = new TorchApi();
});

console.log("Torch | --- Module loaded");
