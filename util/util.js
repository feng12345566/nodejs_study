var co=require("co");


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

