#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const glob = require('glob');
const path_1 = __importDefault(require("path"));
const execSync = require('child_process').execSync;
const pathCmd = path_1.default.resolve(__dirname, './cmd');
const items = glob.sync(`${pathCmd}/**/index.{js,ts}`);
// 加上版本号
const info = require('../package.json');
const version = info.version;
const program = new commander_1.Command();
program.version(version);
// 上次查询的时间戳
let timeQuery = 0;
// 按文件夹名称生成命令
items.forEach((path) => {
    if (path.indexOf('/init/action/') >= 0)
        return;
    let item = require(path);
    const cmdData = item.default || item;
    const name = path.replace(`${pathCmd}/`, '').replace(/\/index\.(?:js|ts)/, '');
    const arg = cmdData.arguments || [];
    // 命令 name
    const cmd = program.command(`${name} ${arg.map(item => getArgsName(item)).join(' ')}`);
    cmdData.desc && cmd.description(cmdData.desc);
    cmdData.options.forEach(item => cmd.option(item.name, item.desc, item.default));
    cmd.action((...args) => {
        // 获取最新的版本号
        const timeNow = Date.now();
        if (timeNow - timeQuery >= 60000) {
            try {
                const result = execSync(`npm view ${info.name} version`);
                const versionNow = result.toString().trim();
                if (versionNow !== version)
                    console.log(`\n发现新版本${versionNow}(当前版本${version})，请执行下面语句更新\nsudo npm i @ncfe/ncli -g\n`);
                timeQuery = timeNow;
            }
            catch (e) { }
        }
        const data = {};
        arg.forEach((item, nIndex) => (data[item.name] = args[nIndex]));
        if (!item.action)
            return;
        item.action(data, args[arg.length], cmd.opts()).catch((e) => {
            throw e;
        });
    });
});
const args = [...process.argv];
program.parse(args);
function getArgsName(item) {
    const sName = `${item.name}${item.multi ? '...' : ''}`;
    return item.required ? `<${sName}>` : `[${sName}]`;
}
