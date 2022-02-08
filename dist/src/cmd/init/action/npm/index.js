"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const shelljs_1 = (0, tslib_1.__importDefault)(require("shelljs"));
const water_inquirer_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.inquirer"));
const util_1 = (0, tslib_1.__importDefault)(require("../../util/util"));
exports.default = {
    desc: '创建npm包',
    async action(oPackage, dir) {
        const sPathPackage = `${dir}/package.json`;
        const bExist = fs_extra_1.default.existsSync(sPathPackage);
        if (bExist) {
            console.log('当前已经存在npm配置，无法继续创建');
            return process.exit();
        }
        let name = oPackage.name?.trim();
        const isFirstInit = !name;
        while (!name)
            name = await water_inquirer_1.default.input('请输入包名，比如 @water7322/water.base :');
        await util_1.default.cloneGit(dir, 'npm模板', 'git@github.com:water7322/water.cli-npm-template.git');
        Object.assign(oPackage, require(`${dir}/package.json`));
        delete oPackage.private;
        oPackage.name = name;
        if (isFirstInit) {
            shelljs_1.default.cd(dir);
            shelljs_1.default.exec(`git init`, { silent: true });
        }
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