import {exec} from 'child_process';

export function execPromise(cmd: string, cwd: string, ...options: any[]) {
    console.log(cmd);
    return new Promise((resolve, reject) => {
        exec(cmd, {cwd, ...options}, error => {
            error ? reject(error) : resolve(null);
        });
    });
}
