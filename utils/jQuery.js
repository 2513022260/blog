(function(global) {
  var jQuery = function(selector, context) {
    return new jQuery.fn.init(selector, context)
  }

  var rootjQuery,
  init = jQuery.fn.init = function(selector, context, root) {
    return jQuery.makeArray(selector, this);
  }
  jQuery(document)

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: init
  }

  // 管理维护代码 jQuery 自身上的方法属性定义在这个之内
  jQuery.extend({ 
    ajax:function(){}
  })

  // 实现平时实例插件的扩展机制
  // 为以后的实例准备jQuery原型构造函数
  jQuery.fn.init.prototype = jQuery.fn
  global.$ = global.jQuery = jQuery
})(this)
