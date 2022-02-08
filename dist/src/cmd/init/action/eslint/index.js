"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const shelljs_1 = (0, tslib_1.__importDefault)(require("shelljs"));
const water_base_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.base"));
exports.default = {
    desc: '添加eslint配置',
    async action(oPackage, dir) {
        const name = `.temp${water_base_1.default.key()}`;
        const path = `${dir}/${name}`;
        const sPathPackage = `${dir}/package.json`;
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
        fs_extra_1.default.copySync(`${path}/tsconfig.json`, `${dir}/tsconfig.json`, { overwrite: true });
        // 移除目录
        fs_extra_1.default.removeSync(path);
        fs_extra_1.default.writeJSONSync(sPathPackage, oPackage, { spaces: 4 });
        shelljs_1.default.cd(dir);
        shelljs_1.default.exec('yarn install');
        if (!fs_extra_1.default.existsSync(`${dir}/.git`)) {
            shelljs_1.default.cd(dir);
            shelljs_1.default.exec('git init', { silent: true });
        }
        if (fs_extra_1.default.existsSync(`${dir}/.git`)) {
            shelljs_1.default.exec('git add .', { silent: true });
            shelljs_1.default.exec('git commit -m "增加配置"', { silent: true });
        }
    }
};
//# sourceMappingURL=index.js.map