import path from 'path';
import Util from '../../util/util';
module.exports = {
    desc: '压缩图片，只支持jpg和png类型',
    arguments: [
        {
            name: 'path',
            required: true
        }
    ],
    options: [
        {
            name: '-r, --replace',
            desc: '替换源文件'
        }
    ],
    async action(oData: any, oParam: any = {}) {
        const sPath: string = path.resolve(oData.path);
        const oInfo = Util.getInfo(sPath);
        try {
            const sToFile = oParam.replace ? sPath : `${oInfo.path}/${Util.getNewName(oInfo.fileName, (sName: string) => `${sName}_tiny`)}`;
            await Util.tinify({
                fromFile: sPath,
                toFile: sToFile
            });
            console.log(`压缩后的图片路径: ${sToFile}`);
            return sToFile;
        } catch (e: any) {
            console.log(e.message);
        }
    }
};
