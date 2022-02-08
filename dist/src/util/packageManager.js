"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const exec_1 = require("./exec");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
/**
 * 获取版本号和-S/-D
 * @param {*} name
 * @returns
 */
async function get(name) {
    try {
        const rootPath = process.cwd();
        const sPathPackage = `${rootPath}/package.json`;
        const bExist = fs_extra_1.default.existsSync(sPathPackage);
        const oPackage = (bExist ? fs_extra_1.default.readJSONSync(sPathPackage) : {}) || {};
        const dep = oPackage.dependencies;
        const devDep = oPackage.devDependencies;
        // TODO 漏了个peer, 考虑加上
        let version = dep[name] || devDep[name];
        version = version?.replace(/[@^~]/, '');
        return [version, dep[name] ? '-S' : '-D'];
    }
    catch (error) {
        //emtpy
    }
}
/**
 * 升级
 * @param {*} name
 * @param {*} minVersion false时重新安装
 * @param {*} [flag]
 * @returns
 */
async function update(name, minVersion, flag) {
    try {
        const [version, _flag] = await get(name);
        if (!version) {
            return install(name + '@latest', flag);
        }
        if (flag !== '-g' && minVersion && isBigVersion(version, minVersion)) {
            return;
        }
        return reInstall(name, flag || _flag, true);
    }
    catch (error) {
        console.log(chalk_1.default.red(`update: ${name}失败`, error));
    }
}
/**
 * 安装依赖
 * @param {*} dep 包名
 * @param {*} flag -S -D -g
 * @return {promise}
 */
function install(dep, flag) {
    return (0, exec_1.execPromise)(`npm i ${dep} ${flag}`, process.cwd()).catch((error) => {
        console.log(chalk_1.default.red(`${dep}安装失败`, error));
        Promise.reject(error);
    });
}
function uninstall(name, flag) {
    return (0, exec_1.execPromise)(`npm uninstall ${name} ${flag}`, process.cwd()).catch((error) => {
        console.log(chalk_1.default.red('husky卸载失败'));
        Promise.reject(error);
    });
}
async function reInstall(name, flag, isLatest = false) {
    try {
        // 尝试卸载
        await uninstall(name, flag);
        // 安装最新版本
        return install(name + (isLatest ? '@latest' : ''), flag);
    }
    catch (error) {
        console.log(chalk_1.default.red(`reInstall: ${name}重装失败`, error));
    }
}
/**
 * 版本比较 v1 >= v2时返回true，否则返回false
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
function isBigVersion(v1, v2) {
    const aV1 = v1.split('.');
    const aV2 = v2.split('.');
    for (let i = 0; i < aV1.length; i++) {
        const v1Item = aV1[i] || 0;
        const v2Item = aV2[i] || 0;
        if (v1Item === v2Item) {
            continue;
        }
        return v1Item > v2Item;
    }
    return true;
}
exports.default = {
    get,
    update,
    install,
    reInstall,
    isBigVersion
};
//# sourceMappingURL=packageManager.js.map