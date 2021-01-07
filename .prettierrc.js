// https://prettier.io/docs/en/options.html
module.exports = {
  // 开启eslint支持
  eslintIntegration: true,
  // 单行最大长度
  printWidth: 120,
  // 设置编辑器每一个水平缩进的空格数
  tabWidth: 2,
  // 在句尾添加分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 在任何可能的多行中输入尾逗号。
  trailingComma: 'none',
  // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格
  bracketSpacing: false,
  // 在jsx中把'>' 是否单独放一行
  jsxBracketSameLine: true,
  // 为单行箭头函数的参数添加圆括号
  arrowParens: 'always',
  // 在顶部插入一个特殊的@format标记，指定文件已被格式化为Prettier
  insertPragma: false,
  endOfLine: 'lf'
};
