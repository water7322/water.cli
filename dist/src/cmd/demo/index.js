"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const ora_1 = (0, tslib_1.__importDefault)(require("ora"));
exports.default = {
    desc: '模板代码，执行不会进行任何操作',
    arguments: [
        // 1、required表示必填
        // 2、mutli表示可以输入多个值
        { name: 'path', required: true },
        { name: 'temp', multi: true }
    ],
    options: [
        {
            name: '-t, --test',
            desc: '这个参数只能得到true || false'
        }
    ],
    async action(data, param) {
        const dir = path_1.default.resolve(data.path);
        const spinner = (0, ora_1.default)(dir);
        spinner.start();
        setTimeout(() => {
            spinner.succeed('Hello world');
            spinner.info(JSON.stringify(data));
            spinner.warn(param.test);
            spinner.fail('error');
        }, 1000);
    }
};
//# sourceMappingURL=index.js.map