// TODO: Add help for right-click (select source) and shift-click (toggle hold)
const CTRL_REF_HTML = (turnOffLights, ctrlOnClick) => {
  return `
<h3>Torch</h3>
<ol class="hotkey-list">
	<li>
		<h4>${turnOffLights}</h4>
		<div class="keys">${ctrlOnClick}</div>
	</li>
</ol>
`;
};

export default class Settings {
  static get playerTorches() {
    return game.settings.get("torch", "playerTorches");
  }
  static get ignoreEquipment() {
    return game.settings.get("torch", "ignoreEquipment");
  }
  static get gmUsesInventory() {
    return game.settings.get("torch", "gmUsesInventory");
  }
  static get userUsesInventory() {
    return game.settings.get("torch", "playerUsesInventory");
  }
  static get fallbackSourceName() {
    return game.settings.get("torch", "fallbackSourceName");
  }
  static get fallbackLightRadii() {
    return {
      bright: game.settings.get("torch", "fallbackBrightRadius"),
      dim: game.settings.get("torch", "fallbackDimRadius"),
    };
  }
  static get gameLightSources() {
    return game.settings.get("torch", "gameLightSources");
  }

  static get dancingLightsVision() {
    return game.system.id === "dnd5e"
      ? game.settings.get("torch", "dancingLightVision")
      : false;
  }

  static get debugLogging() {
    return game.settings.get("torch", "debugLogging");
  }

  static get durationWarningThreshold() {
    return game.settings.get("torch", "durationWarningThreshold");
  }

  static get helpText() {
    let turnOffLights = game.i18n.localize("torch.help.turnOffAllLights");
    let ctrlOnClick = game.i18n.localize("torch.help.holdCtrlOnClick");
    return CTRL_REF_HTML(turnOffLights, ctrlOnClick);
  }
  static register() {
    game.settings.register("torch", "gameLightSources", {
      name: game.i18n.localize("torch.settings.gameLightSources.name"),
      hint: game.i18n.localize("torch.settings.gameLightSources.hint"),
      filePicker: "any",
      scope: "world",
      config: true,
      default: "",
      type: String,
    });
    game.settings.register("torch", "playerTorches", {
      name: game.i18n.localize("torch.settings.playerTorches.name"),
      hint: game.i18n.localize("torch.settings.playerTorches.hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
    game.settings.register("torch", "ignoreEquipment", {
      name: game.i18n.localize("torch.settings.ignoreEquipment.name"),
      hint: game.i18n.localize("torch.settings.ignoreEquipment.hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register("torch", "gmUsesInventory", {
      name: game.i18n.localize("torch.settings.gmUsesInventory.name"),
      hint: game.i18n.localize("torch.settings.gmUsesInventory.hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register("torch", "playerUsesInventory", {
      name: game.i18n.localize("torch.settings.playerUsesInventory.name"),
      hint: game.i18n.localize("torch.settings.playerUsesInventory.hint"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
    if (game.system.id === "dnd5e") {
      game.settings.register("torch", "dancingLightVision", {
        name: game.i18n.localize("torch.settings.dancingLightVision.name"),
        hint: game.i18n.localize("torch.settings.dancingLightVision.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
      });
    }
    game.settings.register("torch", "debugLogging", {
      name: game.i18n.localize("torch.settings.debugLogging.name"),
      hint: game.i18n.localize("torch.settings.debugLogging.hint"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });
    game.settings.register("torch", "durationWarningThreshold", {
      name: game.i18n.localize("torch.settings.durationWarningThreshold.name"),
      hint: game.i18n.localize("torch.settings.durationWarningThreshold.hint"),
      scope: "world",
      config: true,
      default: 0.9,
      type: Number,
      range: {
        min: 0,
        max: 1,
        step: 0.05,
      },
    });
    game.settings.register("torch", "fallbackSourceName", {
      name: game.i18n.localize("torch.settings.fallbackSourceName.name"),
      hint: game.i18n.localize("torch.settings.fallbackSourceName.hint"),
      scope: "world",
      config: true,
      default: "torch",
      type: String,
    });
    game.settings.register("torch", "fallbackBrightRadius", {
      name: game.i18n.localize("torch.settings.fallbackBrightRadius.name"),
      hint: game.i18n.localize("torch.settings.fallbackBrightRadius.hint"),
      scope: "world",
      config: true,
      default: 20,
      type: Number,
    });
    game.settings.register("torch", "fallbackDimRadius", {
      name: game.i18n.localize("torch.settings.fallbackDimRadius.name"),
      hint: game.i18n.localize("torch.settings.fallbackDimRadius.hint"),
      scope: "world",
      config: true,
      default: 40,
      type: Number,
    });
  }
}
