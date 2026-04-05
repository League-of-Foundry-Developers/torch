export default {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://lupestro.net/schemas/torch/light-sources",
  title: "FoundryVTT Torch Module Light Sources",
  description: "Light source descriptions for the Torch Module of FoundryVTT",
  type: "object",
  definitions: {
    light: {
      type: "object",
      $comment:
        "These are defined by the FoundryVTT LightData from app/common/data/data.mjs",
      properties: {
        bright: {
          type: "number",
          minimum: 0,
        },
        dim: {
          type: "number",
          minimum: 0,
        },
        angle: {
          type: "number",
          minimum: 0,
          maximum: 360,
        },
        color: {
          $comment:
            "Safest to use hex #xxxxxx - not sure if it can be named color or triplet",
          type: "string",
        },
        alpha: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        coloration: {
          type: "integer",
        },
        attenuation: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        luminosity: {
          type: "number",
          minimum: -1,
          maximum: 1,
        },
        saturation: {
          type: "number",
          minimum: -1,
          maximum: 1,
        },
        contrast: {
          type: "number",
          minimum: -1,
          maximum: 1,
        },
        shadows: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        negative: {
          $comment: "Introduced in FoundryVTT 12",
          type: "boolean",
        },
        priority: {
          $comment: "Introduced in FoundryVTT 12",
          type: "integer",
          minimum: 0,
        },
        animation: {
          type: "object",
          properties: {
            type: {
              $comment:
                "OOTB you get: ['flame' (for Torch),'torch' (for Flickering Light),'revolving','siren','pulse','chroma','wave','fog','sunburst','dome','emanation','hexa','ghost','energy','roiling','hole','vortex','witchwave','rainbowswirl','radialrainbow','fairy','grid','starlight','smokepatch']",
              type: "string",
            },
            speed: {
              type: "integer",
              minimum: 0,
              maximum: 10,
            },
            intensity: {
              type: "integer",
              minimum: 0,
              maximum: 10,
            },
            reverse: {
              type: "boolean",
            },
          },
        },
        darkness: {
          $comment: "min must be less than or equal to max",
          type: "object",
          properties: {
            min: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            max: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
          },
        },
      },
    },
  },
  additionalProperties: {
    type: "object",
    properties: {
      system: {
        description:
          "The system id of the system to which this set of data applies - must match hash key if supplied",
        type: "string",
      },
      topology: {
        description:
          "The style of actor/item topology this system follows - currently standard or gurps",
        type: "string",
      },
      quantity: {
        description:
          "The field within the item.system data to examine to determine the quantity of the item in the inventory",
        type: "string",
      },
      aliases: {
        type: "object",
        description:
          "A list of new names that act as aliases for a corresponding existing item names",
        additionalProperties: {
          type: "string",
        },
      },
      sources: {
        type: "object",
        description: "Light sources to be recognized on this system",
        additionalProperties: {
          type: "object",
          description:
            "An object representing the settings for a light source - keyed by name",
          properties: {
            name: {
              description:
                "The name of the light source in the inventory - must match key of item in hash",
              type: "string",
            },
            type: {
              description:
                "The type of the item - typically either equipment or spell",
              type: "string",
            },
            consumable: {
              description:
                "Whether an item of this type is consumed with every use, like a candle or torch",
              type: "boolean",
            },
            states: {
              description:
                "The number of states this item goes through - this allows for multistate sources (like high-low-off) - 2 by default",
              type: "integer",
            },
            duration: {
              description:
                "How long the light source lasts in minutes of world time. 0 or omitted means infinite (no auto-extinguish).",
              type: "number",
              minimum: 0,
            },
            light: {
              description:
                "The light definitions - a single one if only one is needed or an array",
              anyOf: [
                {
                  description:
                    "A single light definition that can be used for brevity when the number of states is 2",
                  $ref: "#/definitions/light",
                },
                {
                  type: "array",
                  description:
                    "An array of light definitions - one fewer item in array than the number of states",
                  $comment:
                    "Unfortunately the schema can't enforce the count based on a value",
                  items: {
                    $ref: "#/definitions/light",
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};
