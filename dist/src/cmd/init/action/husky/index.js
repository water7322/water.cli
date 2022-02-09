"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const ora_1 = (0, tslib_1.__importDefault)(require("ora"));
// 本项目资源
const packageManager_1 = (0, tslib_1.__importDefault)(require("../../../../util/packageManager"));
const exec_1 = require("../../../../util/exec");
exports.default = {
    desc: 'husky',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [],
    async action(oData, oParam = {}) {
        try {
            const loading = (0, ora_1.default)(`升级husky...`);
            loading.start();
            const path = process.cwd();
            // 安装/升级 husky v7
            await packageManager_1.default.update('husky', '7.0.4', '-D');
            // 初始化
            await (0, exec_1.execPromise)(`npm set-script prepare "cd ${path} && npx husky install ${path}/.husky"`, path);
            await (0, exec_1.execPromise)(`npm run prepare`, path);
            loading.color = 'green';
            loading.succeed(`husky升级完成`);
        }
        catch (error) {
            console.log(chalk_1.default.red('husky安装升级失败', error));
        }
    }
};
//# sourceMappingURL=index.js.map