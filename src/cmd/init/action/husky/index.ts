import chalk from 'chalk';
import ora from 'ora';
// 本项目资源
import PackManager from '../../../../util/packageManager';
import shell from 'shelljs';

export default {
    desc: 'husky',
    async action(path: string) {
        try {
            const loading = ora(`升级husky...`);
            loading.start();

            shell.cd(path);
            // 安装/升级 husky v7
            PackManager.update('husky', '7.0.4', '-D');
            // 初始化
            shell.exec(`npm set-script prepare "cd ${path} && npx husky install ${path}/.husky"`);
            shell.exec(`npm run prepare`);

            loading.color = 'green';
            loading.succeed(`husky升级完成`);
        } catch (error) {
            console.log(chalk.red('husky安装升级失败', error));
        }
    }
};
