'use strict'

const express = require('express')
const fs = require('fs')


let route = express.Router();

const controller = require('./controller.js')

//0.0请求首页轮播图数据
route.get('/api/getlunbo', controller.getlunbo)

// 获取首页推商品
route.get('/api/recommend', controller.recommend)

// 1.0 请求图文资讯
route.get('/api/getnewslist', controller.getnewslist)

// 2.0 根据资讯id获取资讯详细内容
route.get('/api/getnew/:newid', controller.getnew)

// 3.0 图片分享
route.get('/api/getcatelist/:cateid', controller.getcatelist)
// 3.0.1 图片分享详情中的缩略图数组
route.get('/api/getthumbimages/:imgid', controller.getthumbimages) 
//3.0.2 获取图片分享中的图片详细介绍
route.get('/api/getimageInfo/:imgid', controller.getimageInfo)


// 3.0.2 图片分享分类
route.get('/api/getcategory', controller.getcategory)

//4.0 获取评论内容
route.get('/api/getcomments/:artid', controller.getcomments)
//4.0.1 提交评论数据
route.post('/api/postcomment/:artid', controller.postcomment)

// 5.0 获取商品列表数据
route.get('/api/getgoods', controller.getgoods)
// 6.0 
// 6.0.1 获取详情页轮播图可以直接使用// 3.0.1 图片分享详情中的缩略图数组方法/api/getthumbimages/:imgid
// 6.0.2 获取详情页第二区域块（商品购物区 ,商品标题，价格等）和 参数区域块（商品参数）
route.get('/api/getgoodsinfo/:id', controller.getgoodsinfo)

// 6.0.4 获取图文介绍 
route.get('/api/getgoodsdesc/:id', controller.getgooddesc)
// 6.0.5 获取商品评论 可以直接请求：//4.0 获取评论内容  --》 /api/getcomments/:artid
// 6.0.6 提交评论，可以直接请求： //4.0.1 提交评论数据 ---》 /api/postcomment/:artid
// 6.0.7 获取购物车页面数据
route.get('/api/getshopcarlist/:ids', controller.getshopcarlist)

route.post('/api/post',(req,res)=>{

	var obj = {message:'post 请求 ok'};
	res.end(JSON.stringify(obj));

});

// jsonp演示
route.all('/api/jsonp',(req,res)=>{

	var callbackFn =  req.query.callback;

	var obj = {message:'jsonp 请求 ok'};
	var jsonStr = JSON.stringify(obj);
	res.end(`${callbackFn}('${jsonStr}')`);

});

// 登录
route.post('/api/login', controller.login)

// 注册
route.post('/api/register', controller.register)

// 获取用户收货地址
route.get('/api/getaddress/:user_id', controller.getaddress);

// 用户添加收货地址
route.post('/api/addaddress/:user_id', controller.addaddress);

// 用户删除收货地址
route.post('/api/deladdress/:address_id', controller.deladdress);

// 用户编辑收货地址
route.post('/api/updateaddress/:address_id', controller.updateaddress);


// 生成gentoken
route.get('/api/gentoken', controller.gentoken);

// 验证gentoken
route.post('/api/checktoken', controller.checktoken);


// 提交订单
route.post('/api/commitorder', controller.commitorder)

// 接收微信支付结果异步通知
route.all('/api/notify', controller.notify)

// 获取用户订单
route.post('/api/userorder/:user_id', controller.userorder)



// 获取文章
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
// fs.mkdirSync(__dirname + 'uploads')
route.get('/api/getarticle/', controller.getarticle)
route.get('/api/getonearticle/:id', controller.getOneArticle)
route.post('/api/delarticle/', controller.delarticle)
route.post('/api/addarticle/',controller.addarticle)
route.post('/api/updarticle/', controller.updArticle)
route.post('/api/upload/', upload.single('file'),controller.upload)


route.all('*',controller.notFound)
module.exports = route;

