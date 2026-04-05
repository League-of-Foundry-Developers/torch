import Settings from "./settings.mjs";
import TorchSocket from "./socket.mjs";
import TokenHUD from "./hud.mjs";
import TorchToken from "./token.mjs";
import TorchApi from "./api.mjs";
import SourceLibrary from "./library.mjs";

/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <shurd@FreeBSD.ORG> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.        Stephen Hurd
 * ----------------------------------------------------------------------------
 */

let debugLog = (...args) => {
  if (Settings.debugLogging) {
    console.log("Torch |", ...args);
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
      TokenHUD.addQueryButton(hud, token, hudHtml);
      return;
    }
    /* Manage torch state */
    TokenHUD.addFlameButton(
      hud,
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

  /*
   * Check all tokens for duration-based expiry and warnings.
   * Called from the updateWorldTime hook, GM client only.
   */
  static async checkDurations(worldTime) {
    let scenesChecked = 0;
    let tokensChecked = 0;
    let tokensWithExpiry = 0;
    for (const scene of game.scenes) {
      scenesChecked++;
      for (const tokenDoc of scene.tokens) {
        tokensChecked++;
        let expiresAt = tokenDoc.getFlag("torch", "expiresAt");
        if (expiresAt === undefined) continue;

        tokensWithExpiry++;
        let state = tokenDoc.getFlag("torch", "lightSourceState");
        let sourceName = tokenDoc.getFlag("torch", "lightSource");
        debugLog(
          `checkDurations — token="${tokenDoc.name}" scene="${scene.name}"` +
            ` source="${sourceName}" state="${state}"` +
            ` expiresAt=${expiresAt} worldTime=${worldTime}` +
            ` delta=${expiresAt - worldTime}s`,
        );

        if (!state || state === "off") continue;
        if (!sourceName) continue;

        if (worldTime >= expiresAt) {
          debugLog(
            `checkDurations — EXPIRED: "${sourceName}" on "${tokenDoc.name}"`,
          );
          await Torch.expireSource(scene, tokenDoc, sourceName);
        } else {
          let warnAt = tokenDoc.getFlag("torch", "warnAt");
          let warned = tokenDoc.getFlag("torch", "durationWarned");
          debugLog(
            `checkDurations — not expired yet, warnAt=${warnAt}` +
              ` warned=${warned} pastWarn=${worldTime >= warnAt}`,
          );
          if (warnAt && worldTime >= warnAt && !warned) {
            await Torch.warnLowFuel(tokenDoc, sourceName, expiresAt, worldTime);
          }
        }
      }
    }
    debugLog(
      `checkDurations — scanned ${scenesChecked} scenes,` +
        ` ${tokensChecked} tokens, ${tokensWithExpiry} with active expiry`,
    );
  }

  static async expireSource(scene, tokenDoc, sourceName) {
    let actor = game.actors.get(tokenDoc.actorId);
    if (!actor) {
      debugLog(
        `expireSource — no actor found for actorId="${tokenDoc.actorId}", skipping`,
      );
      return;
    }
    debugLog(
      `expireSource — expiring "${sourceName}" on token="${tokenDoc.name}"` +
        ` actor="${actor.name}"`,
    );
    let library = await SourceLibrary.load(
      game.system.id,
      Settings.fallbackLightRadii.bright,
      Settings.fallbackLightRadii.dim,
      Settings.fallbackSourceName,
      Settings.gameLightSources,
      actor.prototypeToken.light,
      Settings.ignoreEquipment,
    );
    let token = new TorchToken(tokenDoc, library);
    await token.forceStateOff();

    // Notify the token's owners via chat whisper
    let ownerIds = Torch.getTokenOwnerIds(tokenDoc);
    if (ownerIds.length > 0) {
      ChatMessage.create({
        content: game.i18n.format("torch.duration.expired", {
          source: sourceName,
        }),
        whisper: ownerIds,
        speaker: { alias: "Torch" },
      });
    }

    debugLog(`${sourceName} expired on token ${tokenDoc.name}`);
    Hooks.callAll("torch.expired", tokenDoc._object, sourceName);
    Hooks.callAll("torch.changed", tokenDoc._object, sourceName, "off");
  }

  static async warnLowFuel(tokenDoc, sourceName, expiresAt, worldTime) {
    let remaining = Math.max(1, Math.ceil((expiresAt - worldTime) / 60));
    let ownerIds = Torch.getTokenOwnerIds(tokenDoc);
    debugLog(
      `warnLowFuel — "${sourceName}" on "${tokenDoc.name}"` +
        ` remaining=${remaining}min ownerIds=${JSON.stringify(ownerIds)}`,
    );
    if (ownerIds.length > 0) {
      ChatMessage.create({
        content: game.i18n.format("torch.duration.warning", {
          source: sourceName,
          remaining: remaining,
        }),
        whisper: ownerIds,
        speaker: { alias: "Torch" },
      });
    }
    await tokenDoc.setFlag("torch", "durationWarned", true);
    debugLog(
      `${sourceName} low fuel warning on token ${tokenDoc.name} — ${remaining} min remaining`,
    );
  }

  static getTokenOwnerIds(tokenDoc) {
    let actor = game.actors.get(tokenDoc.actorId);
    if (!actor) return [];
    return Object.entries(actor.ownership)
      .filter(
        ([id, level]) =>
          level === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER && id !== "default",
      )
      .map(([id]) => id)
      .filter((id) => game.users.get(id)?.active);
  }

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
  Hooks.on("updateWorldTime", (worldTime /*, dt*/) => {
    debugLog(
      `updateWorldTime hook fired — worldTime=${worldTime}, isGM=${game.user.isGM}`,
    );
    if (!game.user.isGM) return;
    Torch.checkDurations(worldTime);
  });
});

Hooks.on("preUpdateSetting", (doc, changes) => {
  if (doc.key === "torch.gameLightSources") {
    let cleanedValue = changes.value;
    if (changes.value.substring(0, 1) === '"') {
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

export { Torch };
