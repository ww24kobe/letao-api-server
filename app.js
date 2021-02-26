'use strict'

var express = require('express');
var app = express();
var cors = require("cors");
var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser');

require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml());

var xmlparser = require('express-xml-bodyparser'); //引入

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))

// 托管静态资源
app.use('/uploads',express.static('uploads'))

xmlparser({ trim: false, explicitArray: false })

// parse application/json
app.use(bodyParser.json())

//将所有api的请求响应content-type设置为application/json
app.all('/api/*', (req, res, next) => {
    //设置允许跨域响应报文头
    //设置跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    next();
});

// 导入路由模块
var router = require('./router.js');

//挂在到app
app.use('/', router);

app.listen(3000, () => {
    console.log('api服务已启动, 请访问：http://127.0.0.1:3000');
});
