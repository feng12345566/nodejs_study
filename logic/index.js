var myUtil = require('../util/util');
var http = require('http');

function suggestion(params, done) {
	var opt = {
		method: "GET",
		host: "api.map.baidu.com",
		port: 80,
		path: "/place/v2/suggestion?ak=7cBxGEGTEGBb7kNOiaBOLAFV&output=json&q=" + encodeURIComponent(params.q) + "&region=" + encodeURIComponent(params.region)
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

function* search_poi(params) {
	var ret = yield suggestion_g(params)
	return ret;
}
exports.search_poi = search_poi;

var mysql = require('../util/mysqldb');

function* regUser(params) {
	var ret = {
		code: 0,
		msg: "success"
	};
	var regtime = myUtil.now();
	var passpw = myUtil.md5(params.password + regtime);
	var sql = "select user_id from user_account where user_name='" + params.username + "'";
	var re = yield mysql.executSQL_g(sql);
	console.log(re);
	if(re.err || re.data.length == 0) {
		var user = {
			user_name: params.username,
			user_pw: passpw,
			reg_time: regtime
		}
		var step2 = mysql.createStep2("insert into user_account set ?")
		var res = yield mysql.doQuery_g(step2, user);
		console.log(res);
	} else {

		ret.code = -1;
		ret.msg = "用户已注册";
	}

	return ret;
}
exports.regUser = regUser;