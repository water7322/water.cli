"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const shelljs_1 = (0, tslib_1.__importDefault)(require("shelljs"));
const glob_1 = (0, tslib_1.__importDefault)(require("glob"));
const path_1 = (0, tslib_1.__importDefault)(require("../../util/path"));
const util_1 = (0, tslib_1.__importDefault)(require("./util/util"));
const water_inquirer_1 = (0, tslib_1.__importDefault)(require("/Users/water768/water/water.inquirer"));
// const Gitlab = require('../../util/gitlab');
exports.default = {
    desc: '各种常用功能入口',
    arguments: [{ name: 'index', required: false }],
    async action(oData) {
        // const bTest = true;
        const bTest = false;
        const sPath = bTest ? '/Users/water768/water/npmtest/test' : process.cwd();
        bTest && !fs_extra_1.default.existsSync(sPath) && fs_extra_1.default.mkdirSync(sPath, { recursive: true });
        const sPathPackage = `${sPath}/package.json`;
        const bExist = fs_extra_1.default.existsSync(sPathPackage);
        const oPackage = (!bExist ? {} : fs_extra_1.default.readJSONSync(sPathPackage)) || {};
        const aItem = glob_1.default.sync(`${path_1.default.init('./action')}/**/index.{js,ts}`).sort((a, b) => {
            const a1 = parseInt(a.split('/').slice(-2)[0]);
            const b1 = parseInt(b.split('/').slice(-2)[0]);
            return a1 - b1;
        });
        const actions = [];
        aItem.forEach(sItem => {
            const oItem = require(sItem).default;
            actions.push({ text: oItem.desc, value: { action: (...args) => oItem.action(...args) } });
        });
        actions.forEach((oItem, nIndex) => (oItem.text = `${nIndex + 1}.${oItem.text}`));
        let cmd = await water_inquirer_1.default.select('操作类型', [...actions]);
        cmd?.action(oPackage, sPath);
    },
    async npm(oPackage, dir) {
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
        // const bCreate = await Inquirer.confirm('是否在gitlab上创建对应的项目？');
        // if (bCreate) {
        //     try {
        //         await Gitlab.createProject(sSubName, sNcGroup);
        //         console.log(`项目地址：https://gitlab.com/${sNcGroup}/${sSubName}`);
        //     } catch (e) {
        //         console.log(e);
        //         console.log(`创建项目失败，请手动检查`);
        //     }
        // }
    }
};
//# sourceMappingURL=index.js.map