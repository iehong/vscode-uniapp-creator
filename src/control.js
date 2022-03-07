const vscode = require("vscode");
const { access, mkdirSync, writeFile, readFileSync } = require("fs");
const { join, sep } = require("path");
const pageSnippets = require("./page-snippets");
const componentSnippets = require("./component-snippets");

let fileEndName = [".vue", ".js", ".scss"];

const fileEndNames = () => {
  let temp = [];
  let temps = [];
  for (let index = 0; index < fileEndName.length; index++) {
    if (temp.indexOf(fileEndName[index]) == -1) {
      temp.push(fileEndName[index]);
    }
  }
  for (let index = 0; index < temps.length; index++) {
    if (temp.indexOf(temps[index]) == -1 && temps[index]) {
      temp.push(
        temps[index].indexOf(".") == 0 ? temps[index] : `.${temps[index]}`
      );
    }
  }
  return temp;
};

const fileExists = (path, type) => {
  return new Promise((resolve) => {
    let i = 0;
    fileEndNames().forEach((item) => {
      access(`${path}${item}`, (err) => {
        if (!err) {
          vscode.window.showErrorMessage(`此${type}的部分或全部文件已存在`);
          resolve(false);
        } else {
          i++;
        }
        if (i == fileEndNames().length) {
          resolve(true);
        }
      });
    });
  });
};

const createPage = (url, type) => {
  var proot = vscode.workspace.workspaceFolders.filter((i) => {
    return join(url).indexOf(join(i.uri.fsPath)) != -1;
  });

  vscode.window
    .showInputBox({
      placeHolder: `${type == "Page" ? "页面" : "组件"}文件名称`,
      prompt: `请输入${type == "Page" ? "页面" : "组件"}文件名称`,
    })
    .then(async (text) => {
      if (!!text) {
        let snippets = type == "Page" ? pageSnippets : componentSnippets;
        fileExists(join(url, `${text}/index`), type).then((res) => {
          if (res) {
            mkdirSync(join(url, `${text}`));
            fileEndNames().forEach((item) => {
              let name = item.replace(".", "");
              writeFile(
                join(url, `${text}/index${item}`),
                !!snippets[name] ? snippets[name].body : ``,
                () => {}
              );
            });
          }
        });
        if (type == "Page") {
          if (!(await fileExists(join(proot[0].uri.fsPath, "src/pages.json"))))
            return;
          var appJson = {};
          appJson = readFileSync(
            join(proot[0].uri.fsPath, "src/pages.json"),
            "utf-8",
            () => {}
          );
          appJson = JSON.parse(appJson);
          appJson.pages.push({
            path: join(url, `${text}/index`)
              .replace(join(proot[0].uri.fsPath, "/src/"), "")
              .split(sep)
              .join("/"),
          });
          writeFile(
            join(proot[0].uri.fsPath, "src/pages.json"),
            JSON.stringify(appJson, null, "\t"),
            () => {}
          );
        }
      }
    });
};

//命令数组
const commands = {
  create: {
    page: (url) => {
      if (!url) {
        vscode.window
          .showInputBox({
            placeHolder: "页面所在目录路径",
            prompt: "请输入页面所在目录路径",
          })
          .then((text) => {
            if (!!text) {
              createPage(text, "Page");
            }
          });
      } else {
        createPage(url.fsPath, "Page");
      }
    },
    component: (url) => {
      if (!url) {
        vscode.window
          .showInputBox({
            placeHolder: "组件所在目录路径",
            prompt: "请输入组件所在目录路径",
          })
          .then((text) => {
            if (!!text) {
              createPage(text, "component");
            }
          });
      } else {
        createPage(url.fsPath, "component");
      }
    },
  },
};

const control = {
  activate: (context) => {
    vscode.commands.executeCommand(
      "setContext",
      "vscode-vue-creator:init",
      true
    );
    Object.keys(commands).map((name) => {
      if (typeof commands[name] == "function") {
        context.subscriptions.push(
          vscode.commands.registerCommand(`vue.${name}`, commands[name])
        );
      } else if (typeof commands[name] == "object") {
        Object.keys(commands[name]).map((key) => {
          context.subscriptions.push(
            vscode.commands.registerCommand(
              `vue.${name}.${key}`,
              commands[name][key]
            )
          );
        });
      }
    });
  },
};

module.exports = control;
