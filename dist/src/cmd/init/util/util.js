"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const shelljs_1 = (0, tslib_1.__importDefault)(require("shelljs"));
const water_base_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.base"));
const water_inquirer_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.inquirer"));
exports.default = {
    async eslint(oPackage, dir) {
        const name = `.temp${water_base_1.default.key()}`;
        const path = `${dir}/${name}`;
        // 获取最新的代码
        shelljs_1.default.cd(dir);
        shelljs_1.default.exec(`git clone git@github.com:water7322/water.cli-eslint-template.git ${name}`, { silent: true });
        // 复制文件
        const config = require(`${path}/config.js`);
        oPackage.devDependencies = { ...oPackage.devDependencies, ...config.devDependencies };
        oPackage.husky.hooks = { ...oPackage.husky.hooks, ...config.husky.hooks };
        oPackage['lint-staged'] = { ...oPackage['lint-staged'], ...config['lint-staged'] };
        fs_extra_1.default.copySync(`${path}/.eslintignore`, `${dir}/.eslintignore`, { overwrite: true });
        fs_extra_1.default.copySync(`${path}/.eslintrc.js`, `${dir}/.eslintrc.js`, { overwrite: true });
        fs_extra_1.default.copySync(`${path}/.prettierrc.js`, `${dir}/.prettierrc.js`, { overwrite: true });
        fs_extra_1.default.copySync(`${path}/.vscode`, `${dir}/.vscode`, { overwrite: true });
        // 移除目录
        fs_extra_1.default.removeSync(path);
    },
    async cloneGit(dir, title, git) {
        const bContinue = await water_inquirer_1.default.confirm(`将直接当前目录下初始化${title}，是否继续？`);
        if (!bContinue)
            return;
        const name = `.temp${water_base_1.default.key()}`;
        shelljs_1.default.cd(dir);
        shelljs_1.default.exec(`git clone ${git} ${name}`, { silent: true });
        shelljs_1.default.exec(`rm -rf ${dir}/${name}/.git`, { silent: true });
        shelljs_1.default.exec(`cp -rf ${dir}/${name}/ ./`, { silent: true });
        shelljs_1.default.exec(`rm -rf ${dir}/${name}`, { silent: true });
        console.log('❥(^_-) 完成 git clone');
    }
};
//# sourceMappingURL=util.js.map