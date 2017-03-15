var co=require('co');
function handleReq(path,func_g,app){
	app.get(path,function(req,res){
		co(function *(){
			var result = yield * func_g( req.params);
			res.send(result);
		});
		
	});
}
exports.handleReq=handleReq;
