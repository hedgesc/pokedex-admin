module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    "plugin:vue/essential",
    "standard"
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "quotes": [2, "single", { avoidEscape: true }]
  }
};
