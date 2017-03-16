
function handleReq(path,func_g,app){
	app.get(path,function(req,res){
		co(function *(){
			var result = yield * func_g( req.params);
			res.send(result);
		});
		
	});
}
exports.handleReq=handleReq;

var co = function (flow) {
	var generator = flow();
	var next = function (data) {
		var ret = generator.next(data);
		//console.log('get generator return:', ret );
		if (!ret.done) {
			if (Array.isArray(ret.value)) {
				var count = 0;
				var total = 0;
				var results = [];
				//console.log('is array');
				if( ret.value.length ){
					ret.value.forEach(function (item, index) {
						total++; //总计数
						count++; //标识
						if( typeof(item) == 'function' )
							item(function (err, data) {
								count--;
								results[index] = {err:err,data:data};
								if (count === 0 && total === ret.value.length ) {
									next(results);
								}
							});
						else{
							count--;
							results[index] = {err:item[0],data:item[1]}; //arg
							if (count === 0 && total === ret.value.length ) {
								next(results);
							}
						}

					});
				}else{
					next(null);//空数组
				}
			} else {
				if( typeof(ret.value ) == 'function' )
					ret.value(function (err, data) {
						next({err:err,data:data});
					});
				else
					next({err:ret.value[0],data:ret.value[1]}); //arg
			}
		}
	}
	next()
}
exports.co = co;

