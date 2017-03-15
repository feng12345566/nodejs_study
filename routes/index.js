var myUtil=require('../util/util');
var http = require('http');

function suggestion(params,done) {
	var opt = {
		method: "GET",
		host: "api.map.baidu.com",
		port: 80,
		path: "/place/v2/suggestion?ak=7cBxGEGTEGBb7kNOiaBOLAFV&output=json&q=" + encodeURIComponent(params.q)+"&region="+encodeURIComponent(params.region)
	};
	
	var request = http.request(opt, function(serverFeedback) {
		if(serverFeedback.statusCode == 200) {
			var body = "";
			serverFeedback.on('data', function(data) {
					body += data;
				})
				.on('end', function() {
					done(null, body)
				});
		} else {
			done('error');
		}
	});
	request.end();
}

var suggestion_g = myUtil.coHelper(suggestion);


function * search_poi(params) {
	var ret=yield suggestion_g(params)
	return ret;
}
exports.search_poi = search_poi;