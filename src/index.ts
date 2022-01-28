#!/usr/bin/env node
import {Command} from 'commander';
import glob from 'glob';
import path from 'path';
const execSync = require('child_process').execSync;

const pathCmd = path.resolve(__dirname, './cmd');
const cmdPaths = glob.sync(`${pathCmd}/**/index.{js,ts}`);

// 加上版本号
import info from '../package.json';
const version = info.version;
const program = new Command();
// -V, --version
program.version(version);

// 上次查询的时间戳
let timeQuery = 0;

interface CmdData {
    desc: string;
    arguments: (
        | {
              name: string;
              required: boolean;
              multi?: undefined;
          }
        | {
              name: string;
              multi: boolean;
              required?: undefined;
          }
    )[];
    options: {
        name: string;
        desc: string;
        default?: string;
    }[];
    action(data: any, param: any, xxx: any): Promise<any>;
}
// 按文件夹名称生成命令
cmdPaths.forEach((path: string) => {
    if (path.indexOf('/init/action/') >= 0) return;
    let item = require(path);
    const cmdData: CmdData = item.default || item;
    const name = path.replace(`${pathCmd}/`, '').replace(/\/index\.(?:js|ts)/, '');
    const arg = cmdData.arguments || [];
    // 命令 name
    const cmd = program.command(`${name} ${arg.map(item => getArgsName(item)).join(' ')}`);
    cmdData.desc && cmd.description(cmdData.desc);
    cmdData.options.forEach(item => cmd.option(item.name, item.desc, item.default));

    cmd.action((...args: any[]) => {
        // 获取最新的版本号
        const timeNow = Date.now();
        if (timeNow - timeQuery >= 60000) {
            try {
                const result = execSync(`npm view ${info.name} version`);
                const versionNow = result.toString().trim();

                if (versionNow !== version) console.log(`\n发现新版本${versionNow}(当前版本${version})，请执行下面语句更新\nsudo npm i @ncfe/ncli -g\n`);
                timeQuery = timeNow;
            } catch (e) {}
        }

        const data: {[key: string]: any} = {};
        arg.forEach((item, nIndex) => (data[item.name] = args[nIndex]));
        if (!cmdData.action) return;
        cmdData.action(data, args[arg.length], cmd.opts()).catch((e: any) => {
            throw e;
        });
    });
});

const args = [...process.argv];
program.parse(args);

function getArgsName(item: any) {
    const name = `${item.name}${item.multi ? '...' : ''}`;
    return item.required ? `<${name}>` : `[${name}]`;
}
