declare const _default: {
    getInfo(sPath?: string): {
        isFile: boolean;
        isDir: boolean;
        isImage: boolean;
        fileName: string;
        path: string;
        size: number;
        image: {
            type: string;
            width: number;
            height: number;
        };
    };
    getNewName(name: string | undefined, cb: Function): string;
    /**
     * @param {Object} oParam 参数
     *  @param {String} oParam.fromFile 源文件
     *  @param {String} oParam.toFile 目标文件
     */
    tinify(oParam: any): Promise<void>;
    c2p(cb: Function, ctx: any): (...args: any[]) => Promise<void>;
    byte2Size(n?: number, nCount?: number | undefined, sExt?: string | undefined): string;
};
export default _default;
