var express=require('express');
var app=express();
var websvr=require('./util/websvr')
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/sayhello",function (req, res) {	
   res.send('Hello World!');
});


app.get("/login/:username/:password",function (req, res) {	
   var user=req.params;
   var ret="get userinfo username="+user.username+",password="+user.password;
   res.send(ret);
});

var index=require('./routes/index');

websvr.handleReq("/poi/:q/:region",index.search_poi,app);


app.post("/login",function (req, res) {		  
      var user=req.body;
      console.log(user);
      var ret="get userinfo username="+user.username+",password="+user.password;
      res.send(ret);
 });


var server = app.listen(3000);