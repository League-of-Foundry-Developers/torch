//import jsonlint from "jsonlint";
import JSON5 from "json5";
import YAML from "js-yaml";
import Ajv from "ajv";
import getTopology from "./topology.mjs";
import commonSources from "./sources.mjs";
import schema from "./schema.mjs";

/* Library of light sources to use for this system */

export default class SourceLibrary {
  static commonLibrary;
  library;
  ignoreEquipment = false;
  constructor(library) {
    // Only invoke through static factory method load()
    this.library = library;
  }

  static alertOnConfigDataErrors(errors) {
    const errorshtml = errors
      .map((err) => `<span>${err.replaceAll("\n", "<br/>")}</span>`)
      .join("<br/>");
    let warning = new Dialog({
      title: "Loading User Sources Failed",
      content: `<pre style="overflow-x:scroll;text-wrap:wrap"><code>${errorshtml}</code></pre>`,
      buttons: {
        close: {
          label: "Close",
        },
      },
    });
    warning.render(true);
  }

  static async validateSourceJSON(userLibrary, alert) {
    let userData;
    let errors;
    let result = true;
    if (userLibrary === "") {
      // Actually no user library supplied
      return [undefined, {}];
    }

    const yamlFileCheck = (library) => {
      return [".yaml", ".yml"].includes(
        library.substring(library.lastIndexOf(".")),
      );
    };
    const configIsText =
      userLibrary.indexOf("{") === 0 || userLibrary.indexOf("---") === 0;
    const configIsYaml = configIsText
      ? userLibrary.indexOf("---") === 0
      : yamlFileCheck(userLibrary);
    const sourceName = configIsText ? "inline text" : `"${userLibrary}"`;

    let configText = configIsText
      ? userLibrary // To avoid having to build a server running test cases
      : await fetch(userLibrary)
          .then((response) => {
            if (response.status !== 200) {
              errors = [`User library ${userLibrary} not found`];
              result = false;
              return;
            }
            return response.text();
          })
          .catch((reason) => {
            errors = ["Error loading user library: ", reason];
            result = false;
            return;
          });
    // From here on, code is common
    if (result) {
      try {
        if (configIsYaml) {
          userData = YAML.load(configText);
        } else {
          userData = JSON5.parse(configText);
        }
      } catch (e) {
        result = false;
        errors = [e.message];
      }
    }
    if (result) {
      const ajv = new Ajv();
      if (!ajv.validate(schema, userData)) {
        result = false;
        errors = ajv.errors.map((error) => {
          return `${error.keyword} at path "${error.instancePath}" ${error.message}`;
        });
      }
    }
    if (errors) {
      console.warn(
        `Loading user light sources from ${sourceName} failed`,
        errors,
      );
      if (alert) {
        SourceLibrary.alertOnConfigDataErrors(errors);
      }
    } else if (!configIsText) {
      console.log(`User light sources from ${sourceName} loaded`);
    }
    return [errors, userData];
  }

  static applyFieldDefaults(library, reference) {
    for (const system in library) {
      const ref =
        reference && Object.prototype.hasOwnProperty.call(reference, system)
          ? reference[system]
          : null;
      if (!library[system].system) {
        library[system].system = system;
      }
      if (!library[system].topology) {
        library[system].topology = ref ? ref.topology : "standard";
      }
      if (!library[system].quantity) {
        library[system].quantity = ref ? ref.quantity : "quantity";
      }
      if (!library[system].sources) {
        library[system].sources = {};
      }
      const sources = library[system].sources;
      for (const source in sources) {
        const refsrc = ref ? ref.sources[source] : null;
        if (!sources[source].name) {
          sources[source].name = source;
        }
        if (!sources[source].type) {
          sources[source].type = refsrc ? refsrc.type : "equipment";
        }
        if (sources[source].consumable === undefined) {
          sources[source].consumable = refsrc ? refsrc.consumable : false;
        }
        if (sources[source].consumable === "true") {
          sources[source].consumable = true;
        }
        if (sources[source].consumable === "false") {
          sources[source].consumable = false;
        }
        if (sources[source].duration === undefined) {
          sources[source].duration = refsrc ? refsrc.duration || 0 : 0;
        }
        // Normalize lights to be an array, not a single object
        if (
          sources[source].light &&
          sources[source].light.constructor.name !== "Array"
        ) {
          sources[source].light = [sources[source].light];
        }
        // If states isn't specified, derive it by counting the lights and adding one for "off" state.
        if (
          sources[source].light &&
          sources[source].light.constructor.name === "Array" &&
          !sources[source].states
        ) {
          sources[source].states = sources[source].light.length + 1;
        }
      }
      // Now apply any aliases found to reference the same source
      if (library[system].aliases) {
        if (!library[system].sources) {
          library[system].sources = {};
        }
        let sources = library[system].sources;
        let aliases = library[system].aliases;
        for (const alias in aliases) {
          let aliasref = aliases[alias];
          let aliasedSource = sources[aliasref]
            ? sources[aliasref]
            : ref && ref.sources[aliasref]
              ? ref.sources[aliasref]
              : null;
          if (aliasedSource) {
            sources[alias] = Object.assign({}, aliasedSource, { name: alias });
          }
        }
      }
    }
  }

  static updateFallbackLightSource(library, item, bright, dim) {
    const hash = library.sources;
    const name = Object.keys(hash)[0];
    if (item) {
      delete hash[name];
      hash[item] = {
        name: item,
        type: "none",
        consumable: false,
        states: 2,
        light: [{ bright: bright, dim: dim, angle: 360 }],
      };
    } else {
      hash[name].light[0].bright = bright;
      hash[name].light[0].dim = dim;
    }
  }

  static async load(
    systemId,
    selfBright,
    selfDim,
    selfItem,
    userLibrary,
    protoLight,
    ignoreEquipment,
  ) {
    // The common library is now baked in as source but applied only once.
    if (!SourceLibrary.commonLibrary) {
      SourceLibrary.commonLibrary = commonSources;
      this.applyFieldDefaults(SourceLibrary.commonLibrary);
    }

    // If userLibrary is a string, it needs to be fetched, otherwise it is literal data.
    let userData;
    if (userLibrary) {
      if (typeof userLibrary === "string") {
        [, userData] = await SourceLibrary.validateSourceJSON(
          userLibrary,
          true,
        );
      } else {
        userData = userLibrary;
      }
      if (userData) {
        // User library supplied as object
        this.applyFieldDefaults(userData, SourceLibrary.commonLibrary);
      }
    } else {
      // No user library supplied
      userData = {};
    }
    // The user library reloads every time you open the HUD to permit cut and try.
    let mergedLibrary = mergeLibraries(
      userData,
      SourceLibrary.commonLibrary,
      ignoreEquipment, //Makes nothing consumable
    );

    // All local changes here take place against the merged data, which is a copy,
    // not against the common or user libraries. Likewise, ignoreEquipment turns
    // off consumable across the merged data only.
    if (mergedLibrary[systemId]) {
      // Since we're always drawing from the raw common or user library data,
      // the initial topology here is always the topology name and not the object.
      // So this overwrite of the topology is safe.
      mergedLibrary[systemId].topology = getTopology(
        mergedLibrary[systemId].topology,
        mergedLibrary[systemId].quantity,
      );
      let library = new SourceLibrary(mergedLibrary[systemId]);
      library.ignoreEquipment = ignoreEquipment;
      return library;
    } else {
      // This clause should be a clone of the if clause above for the systemId "default",
      // with the fallback light source update from settings in the middle.
      mergedLibrary["default"].topology = getTopology(
        mergedLibrary["default"].topology,
        mergedLibrary["default"].quantity,
      );
      this.updateFallbackLightSource(
        mergedLibrary["default"],
        selfItem,
        selfBright,
        selfDim,
      );
      const library = new SourceLibrary(mergedLibrary["default"]);
      library.ignoreEquipment = ignoreEquipment;
      return library;
    }
  }

  /* Instance methods */
  get lightSources() {
    return this.library.sources;
  }
  getLightSource(name) {
    if (name) {
      for (let sourceName in this.library.sources) {
        if (sourceName.toLowerCase() === name.toLowerCase()) {
          return this.library.sources[sourceName];
        }
      }
    }
    return;
  }
  getInventory(actor, lightSourceName) {
    let source = this.getLightSource(lightSourceName);
    return this.library.topology.getInventory(actor, source);
  }
  async _presetInventory(actor, lightSourceName, quantity) {
    // For testing
    let source = this.getLightSource(lightSourceName);
    return this.library.topology.setInventory(actor, source, quantity);
  }
  async decrementInventory(actor, lightSourceName) {
    let source = this.getLightSource(lightSourceName);
    return this.library.topology.decrementInventory(actor, source);
  }
  getImage(actor, lightSourceName) {
    let source = this.getLightSource(lightSourceName);
    return this.library.topology.getImage(actor, source);
  }
  actorHasLightSource(actor, lightSourceName) {
    let source = this.getLightSource(lightSourceName);
    return (
      this.ignoreEquipment ||
      this.library.topology.actorHasLightSource(actor, source)
    );
  }
  actorLightSources(actor) {
    let result = [];
    for (let source in this.library.sources) {
      if (
        this.ignoreEquipment ||
        this.library.topology.actorHasLightSource(
          actor,
          this.library.sources[source],
        )
      ) {
        let actorSource = Object.assign(
          {
            image: this.library.topology.getImage(
              actor,
              this.library.sources[source],
            ),
          },
          this.library.sources[source],
        );
        result.push(actorSource);
      }
    }
    return result;
  }
}

/*
 * Create a merged copy of two libraries.
 */
let mergeLibraries = function (
  userLibrary,
  commonLibrary,
  nothingIsConsumable,
) {
  let mergedLibrary = {};

  // Merge systems - system properties come from common library unless the system only exists in user library
  for (let system in commonLibrary) {
    mergedLibrary[system] = {
      system: commonLibrary[system].system,
      topology: commonLibrary[system].topology,
      quantity: commonLibrary[system].quantity,
      sources: {},
    };
  }
  if (userLibrary) {
    for (let system in userLibrary) {
      if (!(system in commonLibrary)) {
        mergedLibrary[system] = {
          system: userLibrary[system].system,
          topology: userLibrary[system].topology,
          quantity: userLibrary[system].quantity,
          sources: {},
        };
      }
    }
  }

  // Merge sources - source properties in user library override properties in common library
  for (let system in mergedLibrary) {
    if (userLibrary && system in userLibrary) {
      for (let source in userLibrary[system].sources) {
        let userSource = userLibrary[system].sources[source];
        mergedLibrary[system].sources[source] = {
          name: userSource["name"],
          type: userSource["type"],
          consumable: nothingIsConsumable ? false : userSource["consumable"],
          states: userSource["states"],
          duration: userSource["duration"] || 0,
          light: Object.assign({}, userSource["light"]),
        };
      }
    }
    // Finally, we will deal with the common library for whatever is left
    if (system in commonLibrary) {
      for (let source in commonLibrary[system].sources) {
        if (
          !userLibrary ||
          !(system in userLibrary) ||
          !(source in userLibrary[system].sources)
        ) {
          let commonSource = commonLibrary[system].sources[source];
          mergedLibrary[system].sources[source] = {
            name: commonSource["name"],
            type: commonSource["type"],
            consumable: nothingIsConsumable
              ? false
              : commonSource["consumable"],
            states: commonSource["states"],
            duration: commonSource["duration"] || 0,
            light: Object.assign({}, commonSource["light"]),
          };
        }
      }
    }
  }
  return mergedLibrary;
};
