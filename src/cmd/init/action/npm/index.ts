import fs from 'fs-extra';
import shell from 'shelljs';
import Inquirer from '/Users/water768/water/water.inquirer';
import util from '../../util/util';

export default {
    desc: '创建npm包',
    async action(oPackage: any, dir: string) {
        const sPathPackage = `${dir}/package.json`;
        const bExist = fs.existsSync(sPathPackage);
        if (bExist) {
            console.log('当前已经存在npm配置，无法继续创建');
            return process.exit();
        }
        let name: string = oPackage.name?.trim();
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
        fs.writeJSONSync(sPathPackage, oPackage, {spaces: 4});
        shell.cd(dir);
        shell.exec('yarn install');
        if (!fs.existsSync(`${dir}/.git`)) {
            shell.cd(dir);
            shell.exec('git init', {silent: true});
        }
        if (fs.existsSync(`${dir}/.git`)) {
            shell.exec('git add .', {silent: true});
            shell.exec('git commit -m "增加配置"', {silent: true});
        }
    }
};
