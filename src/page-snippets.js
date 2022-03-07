const { readFileSync } = require("fs");
const { join } = require("path");

const snippets = {
  vue: {
    body: readFileSync(join(__dirname, "template", "page/index.vue"), "utf8"),
  },
  js: {
    body: readFileSync(join(__dirname, "template", "page/index.js"), "utf8"),
  },
  scss: {
    body: readFileSync(join(__dirname, "template", "page/index.scss"), "utf8"),
  },
};

module.exports = snippets;
