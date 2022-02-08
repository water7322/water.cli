"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const ora_1 = (0, tslib_1.__importDefault)(require("ora"));
// 本项目资源
const exec_1 = require("../../../../util/exec");
const packageManager_1 = (0, tslib_1.__importDefault)(require("../../../../util/packageManager"));
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
// 当前模块资源
exports.default = {
    desc: '增加linstaged',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [],
    async action(oData, oParam = {}) {
        try {
            const loading = (0, ora_1.default)(`升级lintstaged...`);
            loading.start();
            const path = process.cwd();
            // 更新包
            await packageManager_1.default.update('lint-staged', false, '-D');
            // 生成配置文件
            fs_extra_1.default.copySync(`${__dirname}/.lintstagedrc`, `${path}/.lintstagedrc`, { overwrite: true });
            // 集成于husky
            await (0, exec_1.execPromise)(`npx husky add .husky/pre-commit "cd ${path} && npx lint-staged"`, path);
            loading.color = 'green';
            loading.succeed(`lintstaged升级完成`);
        }
        catch (error) {
            console.log(chalk_1.default.red('lintstaged安装升级失败', error));
        }
    }
};
//# sourceMappingURL=index.js.map