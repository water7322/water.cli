"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const util_1 = (0, tslib_1.__importDefault)(require("../../util/util"));
exports.default = {
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
    async action(oData, oParam = {}) {
        const sPath = path_1.default.resolve(oData.path);
        const oInfo = util_1.default.getInfo(sPath);
        try {
            const sToFile = oParam.replace ? sPath : `${oInfo.path}/${util_1.default.getNewName(oInfo.fileName, (sName) => `${sName}_tiny`)}`;
            await util_1.default.tinify({
                fromFile: sPath,
                toFile: sToFile
            });
            console.log(`压缩后的图片路径: ${sToFile}`);
            return sToFile;
        }
        catch (e) {
            console.log(e.message);
        }
    }
};
//# sourceMappingURL=index.js.map