const { readFileSync } = require("fs");
const { join } = require("path");

const snippets = {
  vue: {
    body: readFileSync(
      join(__dirname, "template", "component/index.vue"),
      "utf8"
    ),
  },
  ts: {
    body: readFileSync(
      join(__dirname, "template", "component/index.ts"),
      "utf8"
    ),
  },
  scss: {
    body: readFileSync(
      join(__dirname, "template", "component/index.scss"),
      "utf8"
    ),
  },
};

module.exports = snippets;
