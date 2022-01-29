import path from 'path';
export default {
    root(dir = '') {
        const sRoot = path.resolve(__dirname, '../');
        dir && (dir = (/^\.\//.test(dir) ? '' : './') + dir);
        return path.resolve(sRoot, dir);
    },
    init(dir = '') {
        return path.resolve(this.root('./cmd/init'), dir);
    },
    tpl(dir = '') {
        const root = path.resolve(__dirname, '../../tpl/');
        dir && (dir = (/^\.\//.test(dir) ? '' : './') + dir);
        return path.resolve(root, dir);
    }
};
