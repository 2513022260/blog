const head = require('./config/head.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  title: '旗木五五开',
  description: '个人博客，用于技术博客、技术分享、文章整理。',
  markdown: {
    lineNumbers: true, // 代码行号
  },
  head,
  themeConfig
}