#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const glob_1 = (0, tslib_1.__importDefault)(require("glob"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const child_process_1 = require("child_process");
const pathCmd = path_1.default.resolve(__dirname, './cmd');
const cmdPaths = glob_1.default.sync(`${pathCmd}/**/index.{js,ts}`);
// 加上版本号
const package_json_1 = (0, tslib_1.__importDefault)(require("../package.json"));
const version = package_json_1.default.version;
const program = new commander_1.Command();
// -V, --version
program.version(version);
// 上次查询的时间戳
let timeQuery = 0;
// 按文件夹名称生成命令
cmdPaths.forEach((path) => {
    if (path.indexOf('/init/action/') >= 0)
        return;
    let item = require(path);
    const cmdData = item.default || item;
    const name = path.replace(`${pathCmd}/`, '').replace(/\/index\.(?:js|ts)/, '');
    const arg = cmdData.arguments || [];
    // 命令 name
    const cmd = program.command(`${name} ${arg.map(item => getArgsName(item)).join(' ')}`);
    cmdData.desc && cmd.description(cmdData.desc);
    cmdData.options?.forEach(item => cmd.option(item.name, item.desc, item.default));
    cmd.action((...args) => {
        // 获取最新的版本号
        const timeNow = Date.now();
        if (timeNow - timeQuery >= 60000) {
            try {
                const result = (0, child_process_1.execSync)(`npm view ${package_json_1.default.name} version`);
                const versionNow = result.toString().trim();
                if (versionNow !== version)
                    console.log(`\n发现新版本${versionNow}(当前版本${version})，请执行下面语句更新\nsudo npm i @ncfe/ncli -g\n`);
                timeQuery = timeNow;
            }
            catch (e) { }
        }
        const data = {};
        arg.forEach((item, nIndex) => (data[item.name] = args[nIndex]));
        if (!cmdData.action)
            return;
        cmdData.action(data, args[arg.length], cmd.opts()).catch((e) => {
            throw e;
        });
    });
});
const args = [...process.argv];
program.parse(args);
function getArgsName(item) {
    const name = `${item.name}${item.multi ? '...' : ''}`;
    return item.required ? `<${name}>` : `[${name}]`;
}
//# sourceMappingURL=index.js.map