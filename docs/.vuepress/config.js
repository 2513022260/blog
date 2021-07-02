const head = require('./config/head.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  theme: 'vdoing', // 使用npm包主题
  title: '旗木五五开',
  description: '个人博客，用于技术博客、技术分享、文章整理。',
  base: '/blog/',
  // markdown: {
  //   lineNumbers: true, // 代码行号
  // },
  head,
  themeConfig
}