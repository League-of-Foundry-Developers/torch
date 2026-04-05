import assert from "assert";

// These stubs provide all (and only) the features we use from Foundry objects

export class MockItem {
  name;
  img;
  system;
  constructor(name, quantity) {
    this.name = name;
    this.img = `${name}.png`;
    if (typeof quantity === "undefined") {
      this.system = {};
    } else {
      this.system = { quantity: quantity };
    }
  }
  update(props) {
    for (let prop in props) {
      let subprops = prop.split(".");
      let where = this;
      for (let i = 0; i < subprops.length - 1; i++) {
        where = where[subprops[i]];
      }
      where[subprops[subprops.length - 1]] = props[prop];
    }
  }
}

export class MockActor {
  constructor(id, name, items, protoBright, protoDim) {
    this.system = { id: id };
    this.name = name;
    this.items = items;
    this.prototypeToken = {
      light: {
        bright: protoBright,
        dim: protoDim,
      },
    };
    // Data for stubs of functions that only appear in actors from GURPS topology
    this.findEquipmentByNameMethod;
    this.updateEqtCountDataMethod;
  }
  findEquipmentByName(name) {
    return this.findEquipmentByNameMethod(name);
  }
  updateEqtCount(key, value) {
    return this.updateEqtCountDataMethod(key, value);
  }
}

export class MockToken {
  name;
  system;
  light;
  constructor(actor, lightSource, state) {
    this.name = actor.name;
    this.actor = actor;
    this.actorId = this.actor.system.id;
    this.flags = { torch: {} };
    this.light = {};
    this._object = this;
    if (lightSource) {
      this.flags.torch.lightSource = lightSource;
    }
    if (state) {
      this.flags.torch.lightSourceState = state;
    }
  }
  getFlag(modname, flagname) {
    assert.equal(modname, "torch");
    return this.flags.torch[flagname];
  }
  setFlag(modname, flagname, value) {
    assert.equal(modname, "torch");
    this.flags.torch[flagname] = value;
  }
  update(props) {
    for (let prop in props) {
      let subprops = prop.split(".");
      let where = this;
      for (let i = 0; i < subprops.length - 1; i++) {
        where = where[subprops[i]];
      }
      let lastKey = subprops[subprops.length - 1];
      if (lastKey.startsWith("-=")) {
        delete where[lastKey.substring(2)];
      } else {
        where[lastKey] = props[prop];
      }
    }
  }
}

export class MockScene {
  tokens;
  constructor(system, tokens, gridSize) {
    this.tokens = tokens;
    this.grid = { size: gridSize };
  }
  createEmbeddedDocuments(type, tokens, options) {
    assert.equal(type, "Token");
    assert.deepEqual(options, { temporary: false, renderSheet: false });
    for (const token of tokens) {
      // Add any tokens not already present in the collection
      if (!this.tokens.find((aToken) => aToken.id === token.id)) {
        this.tokens.push(token);
      }
    }
  }
  getEmbeddedDocument(type, token) {
    assert.equal(type, "Token");
    return this.tokens.find((aToken) => aToken.id === token.id);
  }
  deleteEmbeddedDocuments(type, tokens) {
    assert.equal(type, "Token");
    let updatedTokens = [];
    for (const token of this.tokens) {
      // Keep all tokens not appearing on the supplied list
      if (!tokens.find((aToken) => aToken.id === token.id)) {
        updatedTokens.push(token);
      }
    }
    this.tokens = updatedTokens;
  }
}

export class MockGame {
  constructor(system, actors, isGM, settings) {
    this.actorData = actors;
    this.settingsData = settings;
    this.user = { isGM: isGM };
    this.system = { id: system };
    this.time = { worldTime: 0 };
    this.actors = {
      get: (id) => this.getActor(id),
    };
    this.settings = {
      get: (modname, settingName) => this.getSetting(modname, settingName),
    };
    this.expectedRequest;
    this.socket = {
      emit: (name, request) => {
        assert.strictEqual(name, "module.torch");
        assert.strictDeepEqual(request, this.expectedRequest);
      },
    };
  }
  getSetting(modname, settingName) {
    assert.equal(modname, "torch");
    let value = this.settingsData[settingName];
    assert.notEqual(
      value,
      undefined,
      `Value for setting ${settingName} is undefined`,
    );
    return value;
  }
  getActor(id) {
    return this.actorData.find((actor) => actor.system.id === id);
  }
}
