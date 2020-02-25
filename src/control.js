const vscode = require('vscode');
const fs = require('fs');
const pageSnippets = require('./page-snippets');
const componentSnippets = require('./component-snippets');

let fileEndName = [
    '.js',
    '.json',
    '.wxml',
    '.wxss'
]

const fileEndNames = () => {
    let temp = [];
    let temps = vscode.workspace.getConfiguration().get('miniAppTool.fileEndName').split('|');
    for (let index = 0; index < fileEndName.length; index++) {
        if(temp.indexOf(fileEndName[index]) == -1){
            temp.push(fileEndName[index]);
        }
    }
    for (let index = 0; index < temps.length; index++) {
        if(temp.indexOf(temps[index]) == -1){
            temp.push(temps[index].indexOf('.') == 0 ? temps[index] : `.${temps[index]}`);
        }
    }
    return temp;
}

const fileExists = (path, type) => {
    return new Promise(resolve => {
        let i = 0;
        fileEndNames().forEach(item => {
            fs.access(`${path}${item}`, err => {
                if(!err){
                    vscode.window.showErrorMessage(`此${type}的部分或全部文件已存在`);
                    resolve(false);
                }else{
                    i++;
                }
                if(i == fileEndNames().length){
                    resolve(true);
                }
            });
        });
    });
}

const createPage = (url, type) => {
    vscode.window.showInputBox({
        placeHolder: `${type == 'Page' ? '页面' : '组件'}文件名称`,
        prompt: `请输入${type == 'Page' ? '页面' : '组件'}文件名称`
    }).then( text => {
        let snippets = type == 'Page' ? pageSnippets : componentSnippets;
        fileExists(`${url}/${text}`, type).then(res => {
            if(res){
                fileEndNames().forEach(item => {
                    let name = item.replace('.', '');
                    fs.writeFile(`${url}/${text}${item}`, !!snippets[name] ? snippets[name].body.replace(/\$1/g, `${text}${item}`) : ``, () => {});
                });
            }
        });
    });
}

//命令数组
const commands = {
    create: {
        page: url => {
            if(!url){
                vscode.window.showInputBox({
                    placeHolder: "页面所在目录路径",
                    prompt: "请输入页面所在目录路径"
                }).then( text => {
                    createPage(text, 'Page');
                });
            }else{
                createPage(url.fsPath, 'Page');
            }
        },
        component: url => {
            if(!url){
                vscode.window.showInputBox({
                    placeHolder: "组件所在目录路径",
                    prompt: "请输入组件所在目录路径"
                }).then( text => {
                    createPage(text, 'component');
                });
            }else{
                createPage(url.fsPath, 'component');
            }
        }
    }
}

const control = {
    activate: context => {
        Object.keys(commands).map(name => {
            if(typeof commands[name] == "function"){
                context.subscriptions.push(vscode.commands.registerCommand(`miniapptool.${name}`, commands[name]));
            }else if(typeof commands[name] == "object"){
                Object.keys(commands[name]).map(key => {
                    context.subscriptions.push(vscode.commands.registerCommand(`miniapptool.${name}.${key}`, commands[name][key]));
                })
            }
        });
    }
}

module.exports = control