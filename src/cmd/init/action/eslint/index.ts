import fs from 'fs-extra';
import shell from 'shelljs';
import Base from '/Users/water768/water/water.base';

export default {
    desc: '添加eslint配置',
    async action(oPackage: any, dir: string) {
        const name = `.temp${Base.key()}`;
        const path = `${dir}/${name}`;
        const sPathPackage = `${dir}/package.json`;
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
        fs.copySync(`${path}/tsconfig.json`, `${dir}/tsconfig.json`, {overwrite: true});
        // 移除目录
        fs.removeSync(path);

        fs.writeJSONSync(sPathPackage, oPackage, {spaces: 4});
        shell.exec('yarn install');
        if (!fs.existsSync(`${dir}/.git`)) {
            shell.exec('git init', {silent: true});
        }
        if (fs.existsSync(`${dir}/.git`)) {
            shell.exec('git add .', {silent: true});
            shell.exec('git commit -m "增加配置"', {silent: true});
        }
    }
};
