var co=require("co");
var crypto = require('crypto');



var coHelper = function (fn, fnThis) {
	return function () {
		fnThis = fnThis||null;
        //将参数转为数组
		var args = [].slice.call(arguments);
		//
		var pass;
		var notick = false;
		var arg;
		// 在回调函数中植入收集逻辑
		args.push(function () { 
			if (pass) {
				//如果有回调结果收集函数，择执行回调收集函数
				pass.apply(null, arguments);
			}else{
				//
				console.log('warning: no callback');
				notick = true;
				arg = arguments;
			}
		});
		//执行异步方法，回调时也会执行上面push的回调方法
		fn.apply(fnThis, args);
		if( notick ) {
			//若没有回调方法，则
			return  arg;
		}
		return function (fn) { 
			// 传入一个收集函数
			pass = fn;
		};
	};
};
exports.coHelper = coHelper;


exports.md5=function(content){
	//MD5加密参考node官方文档
	var md5 = crypto.createHash('md5');
	md5.update(content);
    var d = md5.digest('hex');
    return d;
}


// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ 
 //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
} 


exports.now=function(){
	return (new Date()).Format("yyyy-MM-dd hh:mm:ss")
}

