"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execPromise = void 0;
const child_process_1 = require("child_process");
function execPromise(cmd, cwd, ...options) {
    console.log(cmd);
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, { cwd, ...options }, error => {
            error ? reject(error) : resolve(null);
        });
    });
}
exports.execPromise = execPromise;
//# sourceMappingURL=exec.js.map