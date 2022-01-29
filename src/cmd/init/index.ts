import fs from 'fs-extra';
import shell from 'shelljs';
import glob from 'glob';
import path from '../../util/path';
import util from './util/util';
import Inquirer from '/Users/water768/water/water.inquirer';
// const Gitlab = require('../../util/gitlab');

export default {
    desc: '各种常用功能入口',
    arguments: [{name: 'index', required: false}],

    async action(oData: {index: number}) {
        // const bTest = true;
        const bTest = false;
        const sPath = bTest ? '/Users/nowcoder/Desktop/npmtest/test' : process.cwd();
        bTest && !fs.existsSync(sPath) && fs.mkdirSync(sPath, {recursive: true});
        const sPathPackage = `${sPath}/package.json`;
        const bExist = fs.existsSync(sPathPackage);
        const oPackage = (!bExist ? {} : fs.readJSONSync(sPathPackage)) || {};
        const aItem = glob.sync(`${path.init('./action')}/**/entry.{js,ts}`).sort((a, b) => {
            const a1 = parseInt(a.split('/').slice(-2)[0]);
            const b1 = parseInt(b.split('/').slice(-2)[0]);
            return a1 - b1;
        });
        const actions: any[] = [
            {text: '创建npm包', value: {items: ['npm', 'eslint']}},
            {text: '添加eslint配置', value: {items: ['eslint']}}
        ];
        aItem.forEach(sItem => {
            const oItem = require(sItem);
            actions.push({text: oItem.desc, value: {action: (...args: any[]) => oItem.action(...args)}});
        });
        actions.forEach((oItem, nIndex) => (oItem.text = `${nIndex + 1}.${oItem.text}`));
        let action = actions[oData.index - 1]?.value;
        !action && (action = await Inquirer.select('操作类型', [...actions]));
        if (action.action) return action.action(oPackage, sPath);
        if (!action.items) return;

        const oMap = {} as any;
        for (let sAction of action.items) {
            oMap[sAction] = true;
            if (sAction === 'npm') {
                if (bExist) {
                    console.log('当前已经存在npm配置，无法继续创建');
                    return process.exit();
                }
                await this.npm(oPackage, sPath);
            }
            sAction === 'eslint' && (await util.eslint(oPackage, sPath));
        }
        fs.writeJSONSync(sPathPackage, oPackage, {spaces: 4});
        if (oMap.eslint || oMap.npm) {
            shell.cd(sPath);
            shell.exec('yarn install');
        }
        if (!fs.existsSync(`${sPath}/.git`)) {
            shell.cd(sPath);
            shell.exec('git init', {silent: true});
        }
        if (fs.existsSync(`${sPath}/.git`)) {
            shell.exec('git add .', {silent: true});
            shell.exec('git commit -m "增加配置"', {silent: true});
        }
    },
    async npm(oPackage: any, dir: string) {
        let name = oPackage.name?.trim();
        const isFirstInit = !name;
        while (!name) name = await Inquirer.input('请输入包名，比如 @water7322/water.base :');
        await util.cloneGit(dir, 'npm模板', 'git@github.com:water7322/water.cli-npm-template.git');
        Object.assign(oPackage, require(`${dir}/package.json`));
        delete oPackage.private;
        oPackage.name = name;
        if (isFirstInit) {
            shell.cd(dir);
            shell.exec(`git init`, {silent: true});
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
