/**
 * 获取版本号和-S/-D
 * @param {*} name
 * @returns
 */
declare function get(name: string): Promise<any[] | undefined>;
/**
 * 升级
 * @param {*} name
 * @param {*} minVersion false时重新安装
 * @param {*} [flag]
 * @returns
 */
declare function update(name: string, minVersion: string | boolean, flag: string): Promise<unknown>;
/**
 * 安装依赖
 * @param {*} dep 包名
 * @param {*} flag -S -D -g
 * @return {promise}
 */
declare function install(dep: string, flag: string): Promise<unknown>;
declare function reInstall(name: string, flag: string, isLatest?: boolean): Promise<unknown>;
/**
 * 版本比较 v1 >= v2时返回true，否则返回false
 * @param {*} v1
 * @param {*} v2
 * @returns
 */
declare function isBigVersion(v1: string, v2: string): boolean;
declare const _default: {
    get: typeof get;
    update: typeof update;
    install: typeof install;
    reInstall: typeof reInstall;
    isBigVersion: typeof isBigVersion;
};
export default _default;
