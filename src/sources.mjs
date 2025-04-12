export default {
  "dnd5e": {
    "system": "dnd5e",
    "topology": "standard",
    "quantity": "quantity",
    "aliases": {
      "Lantern, Hooded": "Hooded Lantern",
      "Lantern, Bullseye": "Bullseye Lantern",
	  "Antorcha": "Torch",
	  "Vela": "Candle",
	  "Linterna Sorda": "Hooded Lantern",
	  "Linterna Ojo de Buey": "Bullseye Lantern",
	  "Luz": "Light",
	  "Luces Danzantes": "Dancing Lights",
	  "Crear llama, flamear": "Produce Flame",
	  "Candil": "Lamp"
    },
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 5, "dim": 10, "angle": 360 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 20, "dim": 40, "angle": 360 }],
      },
      "Lamp": {
        "name": "Lamp",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 15, "dim": 45, "angle": 360 }],
      },
      "Bullseye Lantern": {
        "name": "Bullseye Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 60, "dim": 120, "angle": 57 }],
      },
      "Hooded Lantern": {
        "name": "Hooded Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          { "bright": 30, "dim": 60, "angle": 360 },
          { "bright": 0, "dim": 5, "angle": 360 },
        ],
      },
      "Light": {
        "name": "Light",
        "type": "cantrip",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 20, "dim": 40, "angle": 360 }],
      },
      "Dancing Lights": {
        "name": "Dancing Lights",
        "type": "cantrip",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 0, "dim": 10, "angle": 360 }],
      },
      "Produce Flame": {
        "name": "Produce Flame",
        "type": "cantrip",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 20, "dim": 40, "angle": 360, "color": "#ff9329", "alpha": 1, "attenuation": 0.8 }],
      },
    },
  },
  "swade": {
    "system": "swade",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 0, "dim": 2, "angle": 360 }],
      },
      "Flashlight": {
        "name": "Flashlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 10, "dim": 10, "angle": 6 }],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 4, "dim": 4, "angle": 360 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 4, "dim": 4, "angle": 360 }],
      },
    },
  },
  "pf1": {
    "system": "pf1",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 0, "dim": 5, "angle": 360 }],
      },
      "Lamp": {
        "name": "Lamp",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 15, "dim": 30, "angle": 360 }],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 30, "dim": 60, "angle": 360 }],
      },
      "Bullseye Lantern": {
        "name": "Bullseye Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 60, "dim": 120, "angle": 90 }],
      },
      "Hooded Lantern": {
        "name": "Hooded Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 30, "dim": 60, "angle": 360 }],
      },
      "Miner's Lantern": {
        "name": "Miner's Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 30, "dim": 60, "angle": 90 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 20, "dim": 40, "angle": 360 }],
      },
    },
  },
  "pf2e": {
    "system": "pf2e",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 0, "dim": 10, "angle": 360 }],
      },
      "Lantern (Hooded)": {
        "name": "Lantern (Hooded)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          { "bright": 30, "dim": 60, "angle": 360 },
          { "bright": 0, "dim": 5, "angle": 360 },
        ],
      },
      "Lantern (Bull's Eye)": {
        "name": "Lantern (Bull's Eye)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 60, "dim": 120, "angle": 90 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 20, "dim": 40, "angle": 360 }],
      },
      "Everburning Torch": {
        "name": "Everburning Torch",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 20, "dim": 40, "color": "#57cdff", "saturation": 0.3, "contrast": 0.3, "shadows": 0.2, "angle": 360,
            "animation": { "type": "torch", "speed": 1, "intensity": 7, "reverse": false },
          },
        ],
      },
    },
  },
  "sfrpg": {
    "system": "sfrpg",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Portable Light, Lantern": {
        "name": "Portable Light, Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 10, "dim": 10, "angle": 360, "color": "#555555", "alpha": 0.5 }],
      },
      "Portable Light, Flashlight": {
        "name": "Portable Light, Flashlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 20, "dim": 20, "angle": 90, "color": "#555555", "alpha": 0.5 }],
      },
      "Portable Light, Beacon": {
        "name": "Portable Light, Beacon",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 20, "dim": 50, "angle": 360, "color": "#555555", "alpha": 0.5 }],
      },
      "Portable Light, Spotlight": {
        "name": "Portable Light, Spotlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 100, "dim": 100, "angle": 90, "color": "#555555", "alpha": 0.5 }],
      },
      "Comm Unit, Personal": {
        "name": "Comm Unit, Personal",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 15, "dim": 15, "angle": 90, "color": "#555555", "alpha": 0.5 }],
      },
      "Dancing Lights": {
        "name": "Dancing Lights",
        "type": "cantrip",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 0, "dim": 10, "angle": 360, "color": "#555555", "alpha": 0.5 }],
      },
    },
  },
  "earthdawn4e": {
    "system": "earthdawn4e",
    "topology": "standard",
    "quantity": "amount",
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 0, "dim": 3, "angle": 360 }],
      },
      "Lantern (Hooded)": {
        "name": "Lantern (Hooded)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          { "bright": 10, "dim": 10, "angle": 360 },
          { "bright": 0, "dim": 10, "angle": 360 },
        ],
      },
      "Lantern (Bullseye)": {
        "name": "Lantern (Bullseye)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 20, "dim": 20, "angle": 3 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 10, "dim": 10, "angle": 360 }],
      },
    },
  },
  "gurps": {
    "system": "gurps",
    "topology": "gurps",
    "quantity": "amount",
    "sources": {
      "Candle, Tallow": {
        "name": "Candle, Tallow",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 0, "dim": 2, "angle": 360, "color": "#ff9329", "alpha": 0.6 }],
      },
      "Flashlight, Heavy": {
        "name": "Flashlight, Heavy",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 30, "dim": 30, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Mini Flashlight": {
        "name": "Mini Flashlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 4, "dim": 5, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Micro Flashlight": {
        "name": "Micro Flashlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 1, "dim": 1, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Survival Flashlight": {
        "name": "Survival Flashlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 1, "dim": 1, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 4, "dim": 5, "angle": 360, "color": "#ff9329", "alpha": 1 }],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [{ "bright": 9, "dim": 10, "angle": 360, "color": "#ff9329", "alpha": 1 }],
      },
      "Bull's-Eye Lantern": {
        "name": "Bull's-Eye Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 9, "dim": 10, "angle": 57, "color": "#ff9329", "alpha": 1 }],
      },
      "Electric Lantern, Small": {
        "name": "Electric Lantern, Small",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 3, "dim": 3, "angle": 360, "color": "#ff9329", "alpha": 1 }],
      },
      "Electric Lantern, Large": {
        "name": "Electric Lantern, Large",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 4, "dim": 5, "angle": 360, "color": "#ff9329", "alpha": 1 }],
      },
      "Small Tactical Light": {
        "name": "Small Tactical Light",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 22, "dim": 25, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Large Tactical Light": {
        "name": "Large Tactical Light",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 95, "dim": 100, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
      "Floodlight": {
        "name": "Floodlight",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 190, "dim": 200, "angle": 6, "color": "#ffd6aa", "alpha": 1 }],
      },
    },
  },
  "dcc": {
    "system": "dcc",
    "topology": "standard",
    "quantity": "quantity",
    "aliases": {
      "Lantern": "Oil",
    },
    "sources": {
      "Torch, each": {
        "name": "Torch, each",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#ff9329", "alpha": 0.2,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#ff9329", "alpha": 0.2,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
    },
  },
  "ose": {
    "topology": "standard",
    "quantity": "quantity.value",
    "sources": {
      "Torches": {
        "type": "item",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 20, "dim": 30, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern": {
        "type": "item",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 20, "dim": 30, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
    },
  },
  "reclaim-the-wild": {
    "system": "reclaim-the-wild",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 0, "dim": 1, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Firewood": {
        "name": "Firewood",
        "type": "equipment",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 2, "dim": 8, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R0)": {
        "name": "Lantern (1h, R0)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 2, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 5, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R1)": {
        "name": "Lantern (1h, R1)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 2, "dim": 3, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 6, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R2)": {
        "name": "Lantern (1h, R2)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 3, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 7, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R3)": {
        "name": "Lantern (1h, R3)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 3, "dim": 4, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 8, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R4)": {
        "name": "Lantern (1h, R4)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 4, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 9, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern (1h, R5)": {
        "name": "Lantern (1h, R5)",
        "type": "equipment",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 4, "dim": 5, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 10, "dim": 0, "angle": 85, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R0)": {
        "name": "Torch (1h, R0)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 4, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R1)": {
        "name": "Torch (1h, R1)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 4, "dim": 5, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R2)": {
        "name": "Torch (1h, R2)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 5, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R3)": {
        "name": "Torch (1h, R3)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 5, "dim": 6, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R4)": {
        "name": "Torch (1h, R4)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 6, "dim": 0, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch (1h, R5)": {
        "name": "Torch (1h, R5)",
        "type": "equipment",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 6, "dim": 7, "angle": 360, "color": "#ff9329", "alpha": 0.5,
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
    },
  },
  "dragonbane": {
    "system": "dragonbane",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Lantern": {
        "name": "Lantern",
        "type": "equipment",
        "consumable": false,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 10, "dim": 10, "angle": 360, "alpha": 0.1, "color": "#f9f06b",
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Oil Lamp": {
        "name": "Oil Lamp",
        "type": "equipment",
        "consumable": false,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 10, "dim": 10, "angle": 360, "alpha": 0.1, "color": "#f9f06b",
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Torch": {
        "name": "Torch",
        "type": "equipment",
        "consumable": false,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 10, "dim": 10, "angle": 360, "alpha": 0.1, "color": "#f9f06b",
            "animation": { "type": "torch", "speed": 5, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Tallow Candle": {
        "name": "Tallow Candle",
        "type": "equipment",
        "consumable": false,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 4, "dim": 4, "angle": 360, "alpha": 0.1, "color": "#f9f06b",
            "animation": { "type": "torch", "speed": 5, "intensity": 3, "reverse": false },
          },
        ],
      },
    },
  },
  "demonlord": {
    "system": "demonlord",
    "topology": "standard",
    "quantity": "quantity",
    "aliases": {
      "Lantern, Spotlight": "Spotlight Lantern",
    },
    "sources": {
      "Candle": {
        "name": "Candle",
        "type": "item",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 1, "dim": 2, "angle": 360, "color": "#ff9329", "alpha": 0.1,
            "animation": { "type": "torch", "speed": "3", "intensity": "1", "reverse": false },
          },
        ],
      },
      "Torch": {
        "name": "Torch",
        "type": "item",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 5, "dim": 10, "angle": 360, "color": "#ff9329", "alpha": 0.1,
            "animation": { "type": "torch", "speed": "1", "intensity": "5", "reverse": false },
          },
        ],
      },
      "Spotlight Lantern": {
        "name": "Spotlight Lantern",
        "type": "item",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 20, "dim": 40, "angle": 53,
            "animation": { "type": "torch", "speed": "1", "intensity": "10", "reverse": false },
          },
        ],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "item",
        "consumable": false,
        "states": 3,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 10, "dim": 20, "angle": 360,
            "animation": { "type": "torch", "speed": "1", "intensity": "10", "reverse": false },
          },
        ],
      },
    },
  },
  "wwn": {
    "system": "wwn",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Torch": {
        "name": "Torch",
        "type": "item",
        "consumable": true,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#ffad58", "alpha": 0.4,
            "animation": { "type": "torch", "speed": 3, "intensity": 5, "reverse": false },
          },
        ],
      },
      "Lantern": {
        "name": "Lantern",
        "type": "item",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#eccd8b", "alpha": 0.4,
            "animation": { "type": "torch", "speed": 2, "intensity": 4, "reverse": false },
          },
        ],
      },
      "Flamesight": {
        "name": "Flamesight",
        "type": "art",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#ffad58", "alpha": 0.4,
            "animation": { "type": "torch", "speed": 3, "intensity": 5, "reverse": false },
          },
        ],
      },
      "The Light of Faith": {
        "name": "The Light of Faith",
        "type": "art",
        "consumable": false,
        "states": 2,
        "light": [
          {
            // eslint-disable-next-line prettier/prettier
            "bright": 15, "dim": 30, "angle": 360, "color": "#eccd8b", "alpha": 0.4,
            "animation": { "type": "torch", "speed": 3, "intensity": 5, "reverse": false },
          },
        ],
      },
    },
  },
  "everyday-heroes": {
    "system": "everyday-heroes",
    "topology": "standard",
    "quantity": "quantity",
    "sources": {
      "Flashlight/Headlamp": {
        "name": "Flashlight/Headlamp",
        "type": "none",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 60, "dim": 60, "angle": 360 }],
      },
      "Glow Sticks": {
        "name": "Glow Sticks",
        "type": "none",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 0, "dim": 20, "angle": 360 }],
      },
    },
  },
  "default": {
    "system": "default",
    "topology": "none",
    "quantity": "quantity",
    "sources": {
      "Self": {
        "name": "Self",
        "type": "none",
        "consumable": false,
        "states": 2,
        "light": [{ "bright": 40, "dim": 20, "angle": 360 }],
      },
    },
  },
};
