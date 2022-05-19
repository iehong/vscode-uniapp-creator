const { readFileSync } = require("fs");
const { join } = require("path");

const snippets = {
  vue: {
    body: readFileSync(join(__dirname, "template", "page/index.vue"), "utf8"),
  },
  html: {
    body: readFileSync(join(__dirname, "template", "page/index.html"), "utf8"),
  },
  less: {
    body: readFileSync(join(__dirname, "template", "page/index.less"), "utf8"),
  },
};

module.exports = snippets;
