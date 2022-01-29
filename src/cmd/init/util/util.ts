import fs from 'fs-extra';
import shell from 'shelljs';
import Base from '/Users/water768/water/water.base';
import Inquirer from '/Users/water768/water/water.inquirer';

export default {
    async eslint(oPackage: any, dir: string) {
        const that = this;
        const name = `.temp${Base.key()}`;
        const path = `${dir}/${name}`;
        // 获取最新的代码
        shell.cd(dir);
        shell.exec(`git clone git@github.com:water7322/water.cli-eslint-template.git ${name}`, {silent: true});
        // 复制文件
        const config = require(`${path}/config.js`);
        oPackage.devDependencies = {...oPackage.devDependencies, ...config.devDependencies};
        oPackage.husky.hooks = {...oPackage.husky.hooks, ...config.husky.hooks};
        oPackage['lint-staged'] = {...oPackage['lint-staged'], ...config['lint-staged']};
        fs.copySync(`${path}/.eslintignore`, `${dir}/.eslintignore`, {overwrite: true});
        fs.copySync(`${path}/.eslintrc.js`, `${dir}/.eslintrc.js`, {overwrite: true});
        fs.copySync(`${path}/.prettierrc.js`, `${dir}/.prettierrc.js`, {overwrite: true});
        fs.copySync(`${path}/.vscode`, `${dir}/.vscode`, {overwrite: true});
        // 移除目录
        fs.removeSync(path);
    },
    async cloneGit(dir: string, title: string, git: string) {
        const bContinue = await Inquirer.confirm(`将直接当前目录下初始化${title}，是否继续？`);
        if (!bContinue) return;
        const name = `.temp${Base.key()}`;
        shell.cd(dir);
        shell.exec(`git clone ${git} ${name}`, {silent: true});
        shell.exec(`rm -rf ${dir}/${name}/.git`, {silent: true});
        shell.exec(`cp -rf ${dir}/${name}/ ./`, {silent: true});
        shell.exec(`rm -rf ${dir}/${name}`, {silent: true});
        console.log('❥(^_-) 完成 git clone');
    }
};
