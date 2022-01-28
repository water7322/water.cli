import sizeOf from 'image-size';
import fs from 'fs-extra';
import tinify from 'tinify';
import keys from '../config/tinypng';
import {ISizeCalculationResult} from '../../node_modules/image-size/dist/types/interface';

export default {
    getInfo(sPath = '') {
        const oState = fs.statSync(sPath);
        const bFile = !!oState?.isFile();
        const oInfo = (bFile && sizeOf(sPath)) as ISizeCalculationResult;
        const aPath = sPath.split('/');
        return {
            isFile: bFile,
            isDir: !!oState?.isDirectory(),
            isImage: !!oInfo,
            fileName: bFile ? decodeURI(aPath.pop() as string) : '',
            path: aPath.join('/'),
            size: oState?.size || 0,
            image: {
                type: (oInfo?.type as string) || '',
                width: (oInfo?.width as number) || 0,
                height: (oInfo?.height as number) || 0
            }
        };
    },
    getNewName(name = '', cb: Function) {
        if (!cb) return name;
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
    async tinify(oParam: any) {
        const oInfo1 = this.getInfo(oParam.fromFile);
        if (!oInfo1.isImage) throw new Error('该路径不是图片');
        if (!['png', 'jpg', 'jpge'].includes(oInfo1.image.type?.toLowerCase?.())) throw new Error('只能压缩png/jpg/jpge文件');
        tinify.key = keys[Math.floor(Math.random() * keys.length)];
        console.log(`图片信息：width: ${oInfo1.image.width}, height: ${oInfo1.image.height}, type: ${oInfo1.image.type}`);
        console.log('正在验证Api key...');
        let oErr = await this.c2p(tinify.validate, tinify)().catch(e => e);
        if (oErr) throw new Error('验证出错，请检查Api key 是否过期');
        console.log('压缩中...');
        let oSource = tinify.fromFile(oParam.fromFile);
        oErr = await this.c2p(oSource.toFile, oSource)(oParam.toFile).catch(e => e);

        if (oErr) throw new Error('出现错误，请重试');
        const oInfo2 = this.getInfo(oParam.toFile);
        if (!oInfo2) throw new Error('压缩失败，请重试');
        console.log(`压缩前:${this.byte2Size(oInfo1.size)}, 压缩后:${this.byte2Size(oInfo2.size)}, 压缩比:${+((oInfo2.size * 100) / oInfo1.size).toFixed(2)}%`);
    },
    c2p(cb: Function, ctx: any) {
        return (...args: any[]) => {
            return new Promise<void>((resolve, reject) => cb.call(ctx, ...args, (e: any) => (e ? reject(e) : resolve())));
        };
    },
    // nCount表示小数保留几位，默认2位小数
    // sExt表示转换的单位，如果不传，则保证转换后 1<=n<1024
    byte2Size(n: number = 0, nCount?: number, sExt?: string) {
        n = +n || 0;
        if (n < 0) return '0MB';
        const nFlag = Math.pow(10, !nCount && nCount !== 0 ? 2 : nCount);
        const aExt = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const aSize = aExt.map((_, nIndex) => Math.pow(1024, nIndex));
        if (n === 0) return '0' + (sExt || aExt[0]);
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
