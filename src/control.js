const vscode = require("vscode");
const fs = require("fs");
const pa = require("path");
const pageSnippets = require("./page-snippets");
const componentSnippets = require("./component-snippets");

let fileEndName = [".js", ".json", ".wxml", ".wxss", ".less"];

const fileEndNames = () => {
  let temp = [];
  let temps = vscode.workspace
    .getConfiguration()
    .get("miniAppTool.fileEndName")
    .split("|");
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
      fs.access(`${path}${item}`, (err) => {
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
  var appJson = {};
  var proot = vscode.workspace.workspaceFolders.filter((i) => {
    return pa.join(url).indexOf(pa.join(i.uri.fsPath)) != -1;
  });
  appJson = fs.readFileSync(
    pa.join(proot[0].uri.fsPath, "app.json"),
    "utf-8",
    (err, data) => {
      if (err) {
        vscode.window.showErrorMessage(`根目录没有app.json`);
        return false;
      }
    }
  );
  console.log(pa.join(proot[0].uri.fsPath, "app.json"));
  appJson = JSON.parse(appJson);

  vscode.window
    .showInputBox({
      placeHolder: `${type == "Page" ? "页面" : "组件"}文件名称`,
      prompt: `请输入${type == "Page" ? "页面" : "组件"}文件名称`,
    })
    .then((text) => {
      if (!!text) {
        let snippets = type == "Page" ? pageSnippets : componentSnippets;
        fileExists(pa.join(url, `${text}/index`), type).then((res) => {
          if (res) {
            fs.mkdirSync(pa.join(url, `${text}`));
            fileEndNames().forEach((item) => {
              let name = item.replace(".", "");
              fs.writeFile(
                pa.join(url, `${text}/index${item}`),
                !!snippets[name] ? snippets[name].body : ``,
                () => {}
              );
            });
          }
        });
        appJson.pages.push(
          pa
            .join(url, `${text}/index`)
            .replace(pa.join(proot[0].uri.fsPath, "/"), "")
            .split(pa.sep)
            .join("/")
        );
        fs.writeFile(
          pa.join(proot[0].uri.fsPath, "app.json"),
          JSON.stringify(appJson, null, "\t"),
          () => {}
        );
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
    Object.keys(commands).map((name) => {
      if (typeof commands[name] == "function") {
        context.subscriptions.push(
          vscode.commands.registerCommand(`miniapptool.${name}`, commands[name])
        );
      } else if (typeof commands[name] == "object") {
        Object.keys(commands[name]).map((key) => {
          context.subscriptions.push(
            vscode.commands.registerCommand(
              `miniapptool.${name}.${key}`,
              commands[name][key]
            )
          );
        });
      }
    });
  },
};

module.exports = control;
