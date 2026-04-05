import TorchSocket from "./socket.mjs";
import Settings from "./settings.mjs";

const debugLog = (...args) => {
  if (Settings.debugLogging) {
    console.log("Torch |", ...args);
  }
};

const getLightUpdates = function (lightSettings) {
  let result = {};
  for (let setting in lightSettings) {
    result["light." + setting] = lightSettings[setting];
  }
  return result;
};
export default class TorchToken {
  STATE_ON = "on";
  STATE_DIM = "dim";
  STATE_OFF = "off";
  _token;
  _library;
  _ownedSources;

  constructor(token, library) {
    this._token = token;
    this._library = library;
    this._ownedSources = library.actorLightSources(this._token.actor);
  }

  get ownedLightSources() {
    return this._ownedSources;
  }

  get lightSourceState() {
    let state = this._token.getFlag("torch", "lightSourceState");
    return typeof state === "undefined" ? this.STATE_OFF : state;
  }

  get currentLightSource() {
    // The one we saved
    let lightSource = this._token.getFlag("torch", "lightSource");
    if (
      lightSource &&
      this._ownedSources.find((item) => item.name === lightSource)
    ) {
      return lightSource;
    }
    // The one the GM asked for
    let itemName = Settings.fallbackSourceName;
    let namedSource = itemName
      ? this._ownedSources.find(
          (item) => item.name.toLowerCase() === itemName.toLowerCase(),
        )
      : undefined;
    if (itemName && !!namedSource) {
      return namedSource.name;
    }
    // The top one on the list
    if (this._ownedSources.length > 0) {
      return this._ownedSources[0].name;
    }
    // Nothing
    return undefined;
  }

  async setCurrentLightSource(value) {
    await this._token.setFlag("torch", "lightSource", value);
  }

  lightSourceIsExhausted(source) {
    if (this._library.getLightSource(source).consumable) {
      let inventory = this._library.getInventory(this._token.actor, source);
      return inventory === 0;
    }
    return false;
  }

  getInventory(source) {
    let sourceObj = this._library.getLightSource(source);
    if (sourceObj && sourceObj.consumable) {
      return this._library.getInventory(this._token.actor, source);
    } else if (sourceObj) {
      return -1;
    }
  }

  get litAt() {
    return this._token.getFlag("torch", "litAt");
  }

  get expiresAt() {
    return this._token.getFlag("torch", "expiresAt");
  }

  get durationWarned() {
    return this._token.getFlag("torch", "durationWarned");
  }

  remainingDuration() {
    let source = this._library.getLightSource(this.currentLightSource);
    if (!source || !source.duration) return null;
    let expiresAt = this.expiresAt;
    if (expiresAt === undefined) return null;
    let remaining = Math.max(0, expiresAt - game.time.worldTime);
    let minutes = Math.ceil(remaining / 60);
    debugLog(
      `remainingDuration — source="${this.currentLightSource}"` +
        ` expiresAt=${expiresAt} worldTime=${game.time.worldTime}` +
        ` remaining=${minutes}min`,
    );
    return minutes;
  }

  /* Orchestrate State Management */

  async forceStateOff() {
    // Need to deal with dancing lights
    let priorState = this._token.getFlag("torch", "lightSourceState");
    await this._token.setFlag("torch", "lightSourceState", this.STATE_OFF);
    await this._turnOffSource(
      priorState === this.STATE_OFF || priorState === undefined,
    );
  }

  async advanceState() {
    let source = this.currentLightSource;
    let state = this.lightSourceState;
    if (this._library.getLightSource(source).states === 3) {
      state =
        state === this.STATE_OFF
          ? this.STATE_ON
          : state === this.STATE_ON
            ? this.STATE_DIM
            : this.STATE_OFF;
    } else {
      state = state === this.STATE_OFF ? this.STATE_ON : this.STATE_OFF;
    }
    await this._token.setFlag("torch", "lightSourceState", state);
    switch (state) {
      case this.STATE_OFF:
        await this._turnOffSource();
        break;
      case this.STATE_ON:
        await this._turnOnSource();
        break;
      case this.STATE_DIM:
        await this._dimSource();
        break;
      default:
        await this._turnOffSource();
    }
    return state;
  }

  // Private internal methods

  async _turnOffSource(wasAlreadyOff) {
    let source = this._library.getLightSource(this.currentLightSource);
    if (TorchSocket.requestSupported("delete", this.currentLightSource)) {
      // separate token lighting
      TorchSocket.sendRequest(
        this._token.id,
        "delete",
        this.currentLightSource,
        source.light,
      );
    } else {
      // self lighting - to turn off, use light settings from prototype token
      let protoToken = game.actors.get(this._token.actorId).prototypeToken;
      await this._token.update(getLightUpdates(protoToken.light));
      if (!wasAlreadyOff & source.consumable) {
        await this._consumeSource(source);
      }
    }
    // Clear duration tracking flags
    debugLog(
      `_turnOffSource — clearing duration flags` +
        ` (had litAt=${this._token.getFlag("torch", "litAt")})`,
    );
    await this._clearDurationFlags();
  }

  async _clearDurationFlags() {
    await this._token.update({
      "flags.torch.-=litAt": null,
      "flags.torch.-=expiresAt": null,
      "flags.torch.-=warnAt": null,
      "flags.torch.-=durationWarned": null,
    });
  }

  async _turnOnSource() {
    let source = this._library.getLightSource(this.currentLightSource);
    if (TorchSocket.requestSupported("create", this.currentLightSource)) {
      // separate token lighting
      TorchSocket.sendRequest(
        this._token.id,
        "create",
        this.currentLightSource,
        source.light[0],
      );
    } else {
      // self lighting
      await this._token.update(getLightUpdates(source.light[0]));
    }
    // Set duration tracking flags if source has a finite duration
    debugLog(
      `_turnOnSource — source="${this.currentLightSource}"` +
        ` duration=${source.duration} worldTime=${game.time.worldTime}`,
    );
    if (source.duration && source.duration > 0) {
      let now = game.time.worldTime;
      let durationSeconds = source.duration * 60;
      let warnThreshold = Settings.durationWarningThreshold;
      let warnAt =
        warnThreshold > 0
          ? now + Math.floor(durationSeconds * warnThreshold)
          : 0;
      debugLog(
        `_turnOnSource — setting duration flags:` +
          ` source="${this.currentLightSource}"` +
          ` litAt=${now} expiresAt=${now + durationSeconds}` +
          ` warnAt=${warnAt} (threshold=${warnThreshold})`,
      );
      await this._token.update({
        "flags.torch.lightSource": this.currentLightSource,
        "flags.torch.litAt": now,
        "flags.torch.expiresAt": now + durationSeconds,
        "flags.torch.warnAt": warnAt,
        "flags.torch.durationWarned": false,
      });
    } else {
      debugLog(
        `_turnOnSource — no duration tracking (duration=${source.duration})`,
      );
    }
  }

  async _dimSource() {
    let source = this._library.getLightSource(this.currentLightSource);
    if (source.states === 3) {
      await this._token.update(getLightUpdates(source.light[1]));
    }
  }

  async _consumeSource(source) {
    if (
      (game.user.isGM && Settings.gmUsesInventory) ||
      (!game.user.isGM && Settings.userUsesInventory)
    ) {
      let count = this._library.getInventory(this._token.actor, source.name);
      if (count) {
        await this._library.decrementInventory(this._token.actor, source.name);
      }
    }
  }
}
