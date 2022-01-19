const fs = require("fs");
const path = require("path");
const snippets = {
  wxml: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.wxml"),
      "utf8"
    ),
  },
  wxss: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.wxss"),
      "utf8"
    ),
  },
  js: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.js"),
      "utf8"
    ),
  },
  json: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.json"),
      "utf8"
    ),
  },
  less: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.less"),
      "utf8"
    ),
  },
  wxs: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "page/index.wxs"),
      "utf8"
    ),
  },
};

module.exports = snippets;
