const fs = require("fs");
const path = require("path");

const snippets = {
  wxml: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.wxml"),
      "utf8"
    ),
  },
  wxss: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.wxss"),
      "utf8"
    ),
  },
  js: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.js"),
      "utf8"
    ),
  },
  json: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.json"),
      "utf8"
    ),
  },
  wxs: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.wxs"),
      "utf8"
    ),
  },
  less: {
    body: fs.readFileSync(
      path.join(__dirname, "template", "component/index.less"),
      "utf8"
    ),
  },
};

module.exports = snippets;
