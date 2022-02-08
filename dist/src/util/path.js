"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
exports.default = {
    root(dir = '') {
        const root = path_1.default.resolve(__dirname, '../');
        dir && (dir = (/^\.\//.test(dir) ? '' : './') + dir);
        return path_1.default.resolve(root, dir);
    },
    init(dir = '') {
        return path_1.default.resolve(this.root('./cmd/init'), dir);
    },
    tpl(dir = '') {
        const root = path_1.default.resolve(__dirname, '../../tpl/');
        dir && (dir = (/^\.\//.test(dir) ? '' : './') + dir);
        return path_1.default.resolve(root, dir);
    }
};
//# sourceMappingURL=path.js.map