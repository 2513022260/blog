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
  themeConfig,
  plugins: [
    [require('./plugins/love-me'), { // 鼠标点击爱心特效
      color: '#11a8cd', // 爱心颜色，默认随机色
      excludeClassName: 'theme-vdoing-content' // 要排除元素的class, 默认空''
    }]
  ]
}