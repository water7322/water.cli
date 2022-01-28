import path from 'path';
import ora from 'ora';
export default {
    desc: '模板代码，执行不会进行任何操作',
    arguments: [
        // 1、required表示必填
        // 2、mutli表示可以输入多个值
        {name: 'path', required: true},
        {name: 'temp', multi: true}
    ],
    options: [
        {
            name: '-t, --test',
            desc: '这个参数只能得到true || false'
        }
    ],
    async action(data: any, param: any) {
        const dir = path.resolve(data.path);
        const spinner = ora(dir);
        spinner.start();
        setTimeout(() => {
            spinner.succeed('Hello world');
            spinner.info(JSON.stringify(data));
            spinner.warn(param.test);
            spinner.fail('error');
        }, 1000);
    }
};
