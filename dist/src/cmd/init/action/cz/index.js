"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
// const ora = require('ora');
// 本项目资源
const packageManager_1 = (0, tslib_1.__importDefault)(require("../../../../util/packageManager"));
const exec_1 = require("../../../../util/exec");
const water_inquirer_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.inquirer"));
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
// 当前模块资源
const husky_1 = (0, tslib_1.__importDefault)(require("../husky"));
const index_1 = (0, tslib_1.__importDefault)(require("../lintstaged/index"));
const czTpl_1 = (0, tslib_1.__importDefault)(require("./czTpl"));
const dirname = __dirname;
exports.default = {
    desc: '给项目添加cz',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [],
    async action(oData, oParam = {}) {
        try {
            const path = process.cwd();
            // 安装依赖
            console.log(chalk_1.default.green('1. 安装依赖'));
            await packageManager_1.default.update('commitizen', false, '-D');
            await packageManager_1.default.update('cz-customizable', false, '-D');
            await packageManager_1.default.update('@commitlint/config-conventional', false, '-D');
            await packageManager_1.default.update('@commitlint/cli', false, '-D');
            // 先安装husky
            console.log(chalk_1.default.green('2. 安装/升级husky'));
            await husky_1.default.action({ path });
            // 生成配置文件
            console.log(chalk_1.default.green('3. 生成配置文件'));
            fs_extra_1.default.outputFileSync(`${path}/.czrc`, (0, czTpl_1.default)(path), { flag: 'w+' });
            fs_extra_1.default.copySync(`${__dirname}/.cz-config.js`, `${path}/.cz-config.js`, { overwrite: true });
            fs_extra_1.default.copySync(`${__dirname}/commintlintTpl.js`, `${path}/commintlintTpl.js`, { overwrite: true });
            // 集成于husky
            console.log(chalk_1.default.green('4. 集成于husky'));
            await (0, exec_1.execPromise)(`npx husky add .husky/prepare-commit-msg 'cd ${path} && exec < /dev/tty && node_modules/.bin/cz --hook || true'`, path);
            await (0, exec_1.execPromise)(`npx husky add .husky/commit-msg 'cd ${path} && npx --no-install commitlint  --edit "$1"'`, path);
            // 升级lintstaged
            console.log(chalk_1.default.green('5. 安装/升级lintstaged'));
            await reInstallLintStaged(path);
            console.log(chalk_1.default.green('6. done, 请手动删除package.json中多余的husky lintstaged配置'));
        }
        catch (error) {
            console.log(chalk_1.default.red('cz安装失败', error));
        }
    }
};
async function reInstallLintStaged(path) {
    const res = await water_inquirer_1.default.confirm('重新安装lintstaged');
    if (!res)
        return;
    await index_1.default.action({ path });
}
//# sourceMappingURL=index.js.map