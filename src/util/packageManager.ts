import {execPromise} from './exec';
import chalk from 'chalk';
import fs from 'fs-extra';

/**
 * 获取版本号和-S/-D
 * @param {*} name
 * @returns
 */

async function get(name: string) {
    try {
        const rootPath = process.cwd();
        const sPathPackage = `${rootPath}/package.json`;
        const bExist = fs.existsSync(sPathPackage);
        const oPackage = (bExist ? fs.readJSONSync(sPathPackage) : {}) || {};

        const dep = oPackage.dependencies;
        const devDep = oPackage.devDependencies;
        // TODO 漏了个peer, 考虑加上
        let version = dep[name] || devDep[name];
        version = version?.replace(/[@^~]/, '');
        return [version, dep[name] ? '-S' : '-D'];
    } catch (error) {
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
async function update(name: string, minVersion: string | boolean, flag: string) {
    try {
        const [version, _flag] = (await get(name)) as string[];
        if (!version) {
            return install(name + '@latest', flag);
        }
        if (flag !== '-g' && minVersion && isBigVersion(version, minVersion as string)) {
            return;
        }
        return reInstall(name, flag || _flag, true);
    } catch (error) {
        console.log(chalk.red(`update: ${name}失败`, error));
    }
}

/**
 * 安装依赖
 * @param {*} dep 包名
 * @param {*} flag -S -D -g
 * @return {promise}
 */
function install(dep: string, flag: string) {
    return execPromise(`npm i ${dep} ${flag}`, process.cwd()).catch((error: any) => {
        console.log(chalk.red(`${dep}安装失败`, error));
        Promise.reject(error);
    });
}
function uninstall(name: string, flag: string) {
    return execPromise(`npm uninstall ${name} ${flag}`, process.cwd()).catch((error: any) => {
        console.log(chalk.red('husky卸载失败'));
        Promise.reject(error);
    });
}
async function reInstall(name: string, flag: string, isLatest = false) {
    try {
        // 尝试卸载
        await uninstall(name, flag);
        // 安装最新版本
        return install(name + (isLatest ? '@latest' : ''), flag);
    } catch (error) {
        console.log(chalk.red(`reInstall: ${name}重装失败`, error));
    }
}

/**
 * 版本比较 v1 >= v2时返回true，否则返回false
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
function isBigVersion(v1: string, v2: string) {
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

export default {
    get,
    update,
    install,
    reInstall,
    isBigVersion
};
