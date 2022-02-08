"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const image_size_1 = (0, tslib_1.__importDefault)(require("image-size"));
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const tinify_1 = (0, tslib_1.__importDefault)(require("tinify"));
const tinypng_1 = (0, tslib_1.__importDefault)(require("../config/tinypng"));
exports.default = {
    getInfo(sPath = '') {
        const oState = fs_extra_1.default.statSync(sPath);
        const bFile = !!oState?.isFile();
        const oInfo = (bFile && (0, image_size_1.default)(sPath));
        const aPath = sPath.split('/');
        return {
            isFile: bFile,
            isDir: !!oState?.isDirectory(),
            isImage: !!oInfo,
            fileName: bFile ? decodeURI(aPath.pop()) : '',
            path: aPath.join('/'),
            size: oState?.size || 0,
            image: {
                type: oInfo?.type || '',
                width: oInfo?.width || 0,
                height: oInfo?.height || 0
            }
        };
    },
    getNewName(name = '', cb) {
        if (!cb)
            return name;
        const aItem = name.split('.');
        // 文件名有后缀就去掉后缀再调用cb
        const bExt = aItem.length > 1;
        const sExt = bExt ? aItem.pop() : '';
        name = aItem.join('.');
        name = cb(name) || name;
        return bExt ? `${name}.${sExt}` : name;
    },
    /**
     * @param {Object} oParam 参数
     *  @param {String} oParam.fromFile 源文件
     *  @param {String} oParam.toFile 目标文件
     */
    async tinify(oParam) {
        const oInfo1 = this.getInfo(oParam.fromFile);
        if (!oInfo1.isImage)
            throw new Error('该路径不是图片');
        if (!['png', 'jpg', 'jpge'].includes(oInfo1.image.type?.toLowerCase?.()))
            throw new Error('只能压缩png/jpg/jpge文件');
        tinify_1.default.key = tinypng_1.default[Math.floor(Math.random() * tinypng_1.default.length)];
        console.log(`图片信息：width: ${oInfo1.image.width}, height: ${oInfo1.image.height}, type: ${oInfo1.image.type}`);
        console.log('正在验证Api key...');
        let oErr = await this.c2p(tinify_1.default.validate, tinify_1.default)().catch(e => e);
        if (oErr)
            throw new Error('验证出错，请检查Api key 是否过期');
        console.log('压缩中...');
        let oSource = tinify_1.default.fromFile(oParam.fromFile);
        oErr = await this.c2p(oSource.toFile, oSource)(oParam.toFile).catch(e => e);
        if (oErr)
            throw new Error('出现错误，请重试');
        const oInfo2 = this.getInfo(oParam.toFile);
        if (!oInfo2)
            throw new Error('压缩失败，请重试');
        console.log(`压缩前:${this.byte2Size(oInfo1.size)}, 压缩后:${this.byte2Size(oInfo2.size)}, 压缩比:${+((oInfo2.size * 100) / oInfo1.size).toFixed(2)}%`);
    },
    c2p(cb, ctx) {
        return (...args) => {
            return new Promise((resolve, reject) => cb.call(ctx, ...args, (e) => (e ? reject(e) : resolve())));
        };
    },
    // nCount表示小数保留几位，默认2位小数
    // sExt表示转换的单位，如果不传，则保证转换后 1<=n<1024
    byte2Size(n = 0, nCount, sExt) {
        n = +n || 0;
        if (n < 0)
            return '0MB';
        const nFlag = Math.pow(10, !nCount && nCount !== 0 ? 2 : nCount);
        const aExt = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const aSize = aExt.map((_, nIndex) => Math.pow(1024, nIndex));
        if (n === 0)
            return '0' + (sExt || aExt[0]);
        let sSize = '';
        let nSize;
        for (let i = 0, l = aSize.length; i < l; i++) {
            nSize = aSize[i];
            const nCount = n / nSize;
            if (sExt === aExt[i] || (!sExt && nCount < 1024) || i + 1 === aSize.length) {
                sSize = Math.round(nCount * nFlag) / nFlag + aExt[i];
                break;
            }
        }
        return sSize;
    }
};
//# sourceMappingURL=util.js.map