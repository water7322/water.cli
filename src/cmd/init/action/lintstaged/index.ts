import chalk from 'chalk';
import ora from 'ora';
// 本项目资源
import PackManager from '../../../../util/packageManager';
import fs from 'fs-extra';
import shell from 'shelljs';
// 当前模块资源

export default {
    desc: '增加linstaged',
    async action(oData: any, oParam = {}) {
        try {
            const loading = ora(`升级lintstaged...`);
            loading.start();

            const path = process.cwd();
            // 更新包
            await PackManager.update('lint-staged', false, '-D');
            // 生成配置文件
            fs.copySync(`${__dirname}/.lintstagedrc`, `${path}/.lintstagedrc`, {overwrite: true});
            // 集成于husky
            shell.exec(`npx husky add .husky/pre-commit "cd ${path} && npx lint-staged"`);

            loading.color = 'green';
            loading.succeed(`lintstaged升级完成`);
        } catch (error) {
            console.log(chalk.red('lintstaged安装升级失败', error));
        }
    }
};
