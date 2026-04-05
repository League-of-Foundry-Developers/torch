module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {},
  env: {
    browser: true,
    es2020: true,
  },
  globals: {
    $: "readable",
    ChatMessage: "readable",
    CONST: "readable",
    Dialog: "readable",
    Hooks: "readable",
    canvas: "readable",
    game: "readable",
    ui: "readable",
    quench: "readable",
  },
  overrides: [
    {
      files: [".eslintrc.js", "src/sources.mjs"],
      rules: {
        "prettier/prettier": [
          "error",
          {
            singleQuote: false,
            printWidth: 120,
            quoteProps: "preserve",
          },
        ],
      },
    },
    {
      files: ["test/*.mjs"],
      globals: {
        it: "readable",
        describe: "readable",
        before: "readable",
        beforeEach: "readable",
        afterEach: "readable",
      },
    },
    {
      files: [".eslintrc.js", "webpack.config.js"],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
