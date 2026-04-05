import Settings from "./settings.mjs";
import SourceLibrary from "./library.mjs";
import TorchToken from "./token.mjs";

export default class TorchAPI {
  async #setup(sceneId, tokenId) {
    let scene = game.scenes.get(sceneId);
    let tokenDoc = scene.tokens.get(tokenId);
    let actor = game.actors.get(tokenDoc.actorId);

    let library = await SourceLibrary.load(
      game.system.id,
      Settings.fallbackLightRadii.bright,
      Settings.fallbackLightRadii.dim,
      Settings.fallbackSourceName,
      Settings.gameLightSources,
      actor.prototypeToken.light,
      Settings.ignoreEquipment,
    );
    return new TorchToken(tokenDoc, library);
  }
  #parmCheck2(fnname, sceneId, tokenId) {
    const idPattern = /[A-Za-z0-9]+/;
    let result;
    if (typeof sceneId !== "string" || !idPattern.test(sceneId)) {
      result = "first parm - scene id - isn't an id string";
    }
    if (typeof tokenId !== "string" || !idPattern.test(tokenId)) {
      result = "second parm - token id - isn't an id string";
    }
    if (result) {
      throw `${fnname} : ${result}`;
    }
  }

  #parmCheck3(fnname, sceneId, tokenId, source) {
    const idPattern = /[A-Za-z0-9]+/;
    let result;
    if (typeof sceneId !== "string" || !idPattern.test(sceneId)) {
      result = "first parm - scene id - isn't an id string";
    }
    if (typeof tokenId !== "string" || !idPattern.test(tokenId)) {
      result = "second parm - token id - isn't an id string";
    }
    if (typeof source !== "string" || source.length < 1) {
      result = "third parm - source name - isn't the name of a light source";
    }
    if (result) {
      throw `${fnname} : ${result}`;
    }
  }

  async toggle(sceneId, tokenId) {
    this.#parmCheck2("toggle", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return await token.advanceState();
  }

  async extinguish(sceneId, tokenId) {
    this.#parmCheck2("extinguish", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return await token.forceStateOff();
  }

  async currentSource(sceneId, tokenId) {
    this.#parmCheck2("currentSource", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return await token.currentLightSource;
  }

  async currentState(sceneId, tokenId) {
    this.#parmCheck2("currentState", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return await token.lightSourceState;
  }

  async equippedSources(sceneId, tokenId) {
    this.#parmCheck2("equippedSources", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return await token.ownedLightSources.map((item) => item.name);
  }

  async selectSource(sceneId, tokenId, source) {
    this.#parmCheck3("selectSource", sceneId, tokenId, source);
    let token = await this.#setup(sceneId, tokenId);
    return await token.setCurrentLightSource(source);
  }

  async inventory(sceneId, tokenId, source) {
    this.#parmCheck3("inventory", sceneId, tokenId, source);
    let token = await this.#setup(sceneId, tokenId);
    return await token.getInventory(source);
  }

  async sourceExhausted(sceneId, tokenId, source) {
    this.#parmCheck3("sourceExhausted", sceneId, tokenId, source);
    let token = await this.#setup(sceneId, tokenId);
    return await token.lightSourceIsExhausted(source);
  }

  async remainingDuration(sceneId, tokenId) {
    this.#parmCheck2("remainingDuration", sceneId, tokenId);
    let token = await this.#setup(sceneId, tokenId);
    return token.remainingDuration();
  }
}
