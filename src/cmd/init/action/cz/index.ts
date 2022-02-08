import chalk from 'chalk';
// const ora = require('ora');
// 本项目资源
import PackManager from '../../../../util/packageManager';
import {execPromise} from '../../../../util/exec';
import Inquirer from '/Users/water768/water/water.inquirer';
import fs from 'fs-extra';
// 当前模块资源
import Husky from '../husky';
import Lintstaged from '../lintstaged/index';
import buildCzTpl from './czTpl';

const dirname = __dirname;
export default {
    desc: '给项目添加cz',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [],
    async action(oData: any, oParam = {}) {
        try {
            const path = process.cwd();
            // 安装依赖
            console.log(chalk.green('1. 安装依赖'));
            await PackManager.update('commitizen', false, '-D');
            await PackManager.update('cz-customizable', false, '-D');
            await PackManager.update('@commitlint/config-conventional', false, '-D');
            await PackManager.update('@commitlint/cli', false, '-D');
            // 先安装husky
            console.log(chalk.green('2. 安装/升级husky'));
            await Husky.action({path});
            // 生成配置文件
            console.log(chalk.green('3. 生成配置文件'));
            fs.outputFileSync(`${path}/.czrc`, buildCzTpl(path), {flag: 'w+'});
            fs.copySync(`${__dirname}/.cz-config.js`, `${path}/.cz-config.js`, {overwrite: true});
            fs.copySync(`${__dirname}/commintlintTpl.js`, `${path}/commintlintTpl.js`, {overwrite: true});
            // 集成于husky
            console.log(chalk.green('4. 集成于husky'));
            await execPromise(
                `npx husky add .husky/prepare-commit-msg 'cd ${path} && exec < /dev/tty && node_modules/.bin/cz --hook || true'`,
                path
            );
            await execPromise(
                `npx husky add .husky/commit-msg 'cd ${path} && npx --no-install commitlint  --edit "$1"'`,
                path
            );
            // 升级lintstaged
            console.log(chalk.green('5. 安装/升级lintstaged'));
            await reInstallLintStaged(path);
            console.log(chalk.green('6. done, 请手动删除package.json中多余的husky lintstaged配置'));
        } catch (error) {
            console.log(chalk.red('cz安装失败', error));
        }
    }
};

async function reInstallLintStaged(path: string) {
    const res = await Inquirer.confirm('重新安装lintstaged');
    if (!res) return;
    await Lintstaged.action({path});
}
