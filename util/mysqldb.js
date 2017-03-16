var mysql = require('mysql');
var async = require('async');
var myUtil = require('./util');
var config = require('../config/config');

//mysqldb:
var FILENAME = __filename.split('/').pop() + ':';

//获得连接池
var _pool = mysql.createPool( config.dbconfig );

exports.setPool = function( cfg ){
	_pool = mysql.createPool( cfg );
}


//执行任意SQL
var executSQL = function ( strSql, doneCB ){

	var step2 = createStep2( strSql, true );
	doQuery( step2, [], doneCB );
};
exports.executSQL = executSQL;
exports.executSQL_g = myUtil.coHelper(executSQL);

//执行一系列SQL,用于批量插入操作
var serialSQL = function ( SQLs, done ){
	//单条语句执行逻辑
	function eachItem( item, next ){
		console.log(FILENAME,'Do SQL: ', item);
		exports.executSQL( item, function (err, results ){
			if( err )
				console.log(FILENAME, err );
			else{
				console.log(FILENAME, 'result:', results);
			}
			//完成后继续执行其他sql
			next();
		});
	}

    //所以sql执行完成回调
	function allDone(){
		done();
	}
	//异步执行所有sql 参考http://caolan.github.io/async/docs.html#eachSeries
	async.eachSeries( SQLs, eachItem, allDone )
}

exports.serialSQL = serialSQL

/**
 * 
 * @param {Object} Step2  执行函数
 * @param {Object} queryParam sql参数
 * @param {Object} doneCB 执行完成回调
 */
function doQuery( Step2, queryParam, doneCB ){
	//数据库连接
	var conn; 
	function step1_getConnection( next ){
		//连接回调
		function got( err, connection ){
			//连接发生错误直接返回
			if( err ) {
				console.log('get connection:',err );
				next( err );//发生错误，不能往下了
				return;
			}
			//获得了连接,继续执行其他逻辑
			conn = connection;
			next( null, conn, queryParam )
		}
		//最新执行这一句，获得连接
		_pool.getConnection(got);
	}

	//执行完成回调
	function finalStep( err, result ){
		if( conn ) 	conn.release();
		//把信息传递出去
		if( !err ){
			for( var p in Step2 ){
				result[p] = Step2[p];
			}
		}
		doneCB( err, result );
	}
	//按队列执行，参考http://caolan.github.io/async/docs.html#waterfall
	async.waterfall( [step1_getConnection, Step2], finalStep );
}

exports.doQuery = doQuery;
exports.doQuery_g = myUtil.coHelper(doQuery);

/**
 * 
 * @param {Object} strSQL sql语句，带参数sql中参数用？号代替
 * @param {Object} noParam 是否为带参sql
 */
function createStep2( strSQL, noParam ){
	function stepFunc( conn, queryParam, next ){
		function queryCB(err, result){
			if( err ){
				console.log(FILENAME, 'stepFunc error ', err );
				next( err );
			}
			else
				next(null, result);
		};
		if( noParam )
			conn.query( strSQL, queryCB );
		else
			conn.query( strSQL, queryParam, queryCB );
	}
	return stepFunc;
}
exports.createStep2 = createStep2;

