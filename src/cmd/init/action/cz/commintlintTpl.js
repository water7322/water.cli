const czConfig = require('./.cz-config');
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', [...czConfig.scopes]] // always 意思是scope必须是数组其中一个，never意思是不可以是数组其中一个
    }
};
