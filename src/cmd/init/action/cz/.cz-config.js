module.exports = {
    // 提交类型
    types: [
      { value: 'feat',        name : 'feat:           添加新特性' },
      { value: 'fix',         name : 'fix:            修复Bug' },
      { value: 'docs',        name : 'docs:           变更文档' },
      { value: 'style',       name : 'style:          修改格式，不影响功能，例如空格、代码格式等' },
      { value: 'refactor',    name : 'refactor:       代码重构，注意和feat perf区分开' },
      { value: 'perf',        name : 'perf:           性能提升' },
      { value: 'test',        name : 'test:           修改或添加测试文件' },
      { value: 'build',       name : 'build:          构建，webpack rollup等' },
      { value: 'ci',          name : 'ci:             修改ci相关配置、脚本等' },
      { value: 'chore',       name : 'chore:          杂务，不属于以上类型' },
      { value: 'revert',      name : 'revert:         回退版本' },
    ],
    // 影响范围
    scopes: ['笔试', '面试', '主站', '其他'],
    // 汉化
    messages: {
      type: '选择一种你的提交类型:',
      scope: '选择修改涉及范围 (可选):',
      // used if allowCustomScopes is true
      // customScope: '请输入本次改动的范围（如：功能、模块等）:',
      subject: '简短说明:\n',
      body: '详细说明，使用"|"分隔开可以换行(可选)：\n',
      breaking: '非兼容性，破坏性变化说明 (可选):\n',
      footer: '关联关闭的issue，例如：#31, #34(可选):\n',
      confirmCommit: '确定提交说明?'
    },
}