import chalk from 'chalk';
import ora from 'ora';
// 本项目资源
import PackManager from '../../../../util/packageManager';
import {execPromise} from '../../../../util/exec';

export default {
    desc: 'husky',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [],
    async action(oData: object, oParam = {}) {
        try {
            const loading = ora(`升级husky...`);
            loading.start();
    
            const path = process.cwd();
            // 安装/升级 husky v5
            await PackManager.update('husky', '5.0.0', '-D');
            // 初始化
            await execPromise(`npm set-script prepare "cd ${path} && npx husky install ${path}/.husky"`, path);
            await execPromise(`npm run prepare`, path);
    
            loading.color = 'green';
            loading.succeed(`husky升级完成`);
        } catch (error) {
            console.log(chalk.red('husky安装升级失败', error));
        }
    }
};
