const path = require("path");
const scopesPath = path.resolve(__dirname, "scopes.js");
const { ALL_SCOPES } = require(scopesPath);

module.exports = {
  ALL_SCOPES,
};
