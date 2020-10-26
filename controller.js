'use strict'

const mysql = require('mysql');
const axios = require('axios');
const path = require('path');
const fs = require('fs');


const {
    query,
    connect
} = require('./utils/model.js');
const md5 = require('md5');
var {
    genToken,
    checkToken
} = require('./utils/token.js');
const {
    log,
    genOrderId,
    utc2Date,
    getDomain
} = require('./utils/tools.js')

var succStatus = 0 // 表示成功
var failStatus = 1 // 表示失败

// 代表返回的数据结构
var response = {
    status: succStatus,
    data: '',
}


var qiniudomain = "http://test.w0824.com/"; // 七牛云存储对象域名

// 定义控制器
var controller = {};

// 获取首页轮播图数据
controller.getlunbo = (req, res) => {
    var response = {
        status: succStatus,
        message: [{
            url: 'http://www.baidu.com',
            img: `${qiniudomain}banner9.png`
        }, {
            url: 'http://jd.com',
            img: `${qiniudomain}banner10.jpg`
        }, {
            url: 'https://www.tmall.com/',
            img: `${qiniudomain}banner11.jpg`
        }]
    }
    res.json(response)
}

// 获取新闻资讯
controller.getnewslist = async (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var pagesize = parseInt(req.query.pagesize) || 10;
    var offset = (page - 1) * pagesize;
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var sql = " SELECT id,channel_id,title,add_time,click,concat('" + qiniudomain + "',img_url) as img_url FROM dt_article where img_url > '' and channel_id in (6,7)  limit " + offset + ',' + pagesize + " "
    var rows = await query(sql)
    response.message = rows;
    res.json(response)
}

// 根据资讯id获取资讯详细内容
controller.getnew = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }

    var newid = req.params.newid

    var sql = 'select id,title,click,add_time,content from dt_article  where id=' + newid
    var rows = await query(sql);
    response.message = rows
    res.json(response);
}

// 首页推荐商品
controller.recommend = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var limit = parseInt(req.query.limit) || 6;
    var sql = `select t1.* , concat('${qiniudomain}',t1.img_url) as img_url,t2.market_price, t2.sell_price 
                from dt_article t1 left join dt_article_attribute_value t2 
                on t1.id = t2.article_id where t1.channel_id = 7 order by rand()  limit ${limit}`;
    var rows = await query(sql)
    response.message = rows;
    res.json(response)

}

controller.getgoods = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var pageindex = req.query.pageindex
    if (!pageindex) {
        pageindex = 1;
    }
    var pagesize = 10
    var skipcount = (pageindex - 1) * pagesize

    var sql = `SELECT a.id,a.title,a.add_time,left(a.zhaiyao,25) as zhaiyao,a.click,concat('${qiniudomain}',a.img_url) as img_url,b.sell_price,b.market_price,b.stock_quantity FROM dt_article as a,dt_article_attribute_value b where a.id = b.article_id and a.channel_id = 7 limit ${skipcount},${pagesize} `
    var rows = await query(sql);
    //获取数据成功
    response.message = rows
    res.json(response)
}


// 商品图文描述
controller.getgooddesc = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }

    var id = req.params.id;
    var sql = ` SELECT title,content FROM dt_article da WHERE da.id = ${id} `
    var rows = await query(sql)
    response.message = rows
    res.json(response)
}

// 获取商品标题，价格，参数区数据
controller.getgoodsinfo = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var artid = req.params.id;
    var sql = ` SELECT t1.id,t1.title,t1.add_time,t1.zhaiyao,t1.content,
                t2.goods_no,t2.stock_quantity,t2.market_price,t2.sell_price 
                FROM dt_article t1 left join  dt_article_attribute_value t2 
                on t1.id = t2.article_id where t1.id = ${artid} `
    var rows = await query(sql);
    // 5.0 获取数据成功
    response.message = rows[0];
    res.json(response)
}

// 获取购物车列表数据
controller.getshopcarlist = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var ids = req.params.ids
    var sql = `
          SELECT count(distinct tb1.id) as cou, tb1.* FROM (
          SELECT  da.id,da.title,daa.sell_price,concat('${qiniudomain}',alb.thumb_path) as thumb_path
          FROM dt_article da 
          LEFT JOIN dt_article_attribute_value daa ON (da.id = daa.article_id)
          LEFT JOIN dt_article_albums alb ON (da.id = alb.article_id)
        WHERE  da.id IN(${ids}) ) AS tb1 GROUP BY tb1.id
        `
    var rows = await query(sql)
    response.message = rows
    res.json(response)
}

// 4.0 获取图片分享指定分类列表数据
controller.getcatelist = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }

    var cateid = req.params.cateid - 0

    var sql = ' select id,title,concat("' + qiniudomain + '",img_url) as img_url,zhaiyao from dt_article where channel_id = 9 and category_id=' + cateid
    try {
        var rows = await query(sql);
        response.message = rows
    } catch (e) {
        response.message = e.message;
        response.status = failStatus
    }


    res.json(response)
}

// 4.0.1 根据商品id或图片id获取图片缩略图
controller.getthumbimages = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }

    // 1.0 获取路由参数值
    var art_id = req.params.imgid

    // 2.0 执行查询操作
    var sql = 'select concat("' + qiniudomain + '",thumb_path)  as src  from dt_article_albums where article_id =' + art_id;

    var rows = await query(sql)
    response.message = rows
    res.json(response)
}

// 4.0.1 根据id获取图片详细内容
controller.getimageInfo = async (req, res) => {
    // 代表返回的数据结构
    var response = {
        status: succStatus,
        message: ''
    }
    var art_id = req.params.imgid

    var sql = `select id,title,click,add_time,content from dt_article where id = ${art_id}`

    var rows = await query(sql)
    response.message = rows;
    res.json(response)
}

// 5.0 获取图片分享数据
controller.getcategory = async (req, res) => {
    var response = {
        status: succStatus,
        message: ''
    }
    var sql = ' select title,id from dt_article_category where channel_id = 9'
    var rows = await query(sql);
    response.message = rows
    res.json(response);
}

// 6.0 获取评论信息
controller.getcomments = async (req, res) => {
    var response = {
        status: succStatus,
        message: ''
    }

    var artid = req.params.artid
    var pageindex = req.query.pageindex

    var pagesize = 5;
    var offset = (pageindex - 1) * pagesize

    var sql = `select  id,user_name,add_time,content from dt_article_comment 
                where article_id = ${artid} order by add_time asc 
                limit ${offset},${pagesize}`
    var rows = await query(sql);
    response.message = rows
    res.json(response)
}

// 7.0 提交评论数据
controller.postcomment = async (req, res) => {

    var artid = req.params.artid
    var content = req.body.content;

    var sql = `insert into  dt_article_comment(article_id,user_name,content,add_time)
              values (${artid},'匿名用户','${content}',NOW())`
    try {
        var rows = await query(sql);
        response.message = '评论提交成功';
    } catch (e) {
        response.message = e.message;
        response.status = failStatus;
    }

    res.json(response)
}

// 用户登录接口
controller.login = async (req, res) => {
    var {
        username,
        password
    } = req.body;

    var sql = `select id,username,tel,email,openid,sex from users where username='${username}' and password='${password}'`
    var rows = await query(sql);
    if (!rows.length) {
        res.json({
            status: failStatus,
            message: "用户名或密码错误"
        })
    } else {
        let userInfo = rows[0];
        let token = genToken(userInfo)
        res.json({
            status: succStatus,
            message: "登录成功",
            userInfo,
            token
        })
    }

}

// 用户注册接口
controller.register = async (req, res) => {
    var {
        username,
        password
    } = req.body;
    //1. 校验用户名唯一性
    var sql = `select id  from users where username='${username}'`
    var rows = await query(sql);
    if (rows.length) {
        res.json({
            status: failStatus,
            message: "用户名已被占用"
        })
    } else {
        var sql = `insert into users(username,password) values('${username}','${password}')`;
        var rows = await query(sql);

        var status = rows.affectedRows ? 0 : 1;
        var message = rows.affectedRows ? '注册成功' : '注册失败';
        var response = {
            status,
            message
        }
        res.json(response)
    }


}

// 获取用户所有收货地址
controller.getaddress = async (req, res) => {
    var {
        user_id
    } = req.params;
    var response = {};
    var sql = `select * from address where user_id = ${user_id}`;
    try {
        var rows = await query(sql);
        response = rows;
    } catch (e) {
        response.message = e.message;
    }

    res.json(response)
}

// 用户添加收货地址
controller.addaddress = async (req, res) => {
    // console.log(req.params)
    var {
        name,
        tel,
        province,
        city,
        country,
        postalCode,
        isDefault,
        areaCode,
        user_id,
        addressDetail
    } = Object.assign(req.body, req.params);
    // var add_time
    var sql = `insert into 
                address(name,tel,province,city,country,postalCode,isDefault,areaCode,addressDetail,user_id,add_time) 
                values('${name}', '${tel}', '${province}', '${city}', '${country}', '${postalCode}', 
                ${isDefault}, '${areaCode}', '${addressDetail}',${user_id},now() )`;
    try {
        var rows = await query(sql);
        response.status = rows.affectedRows ? 0 : 1;
        response.message = rows.affectedRows ? '添加地址成功' : '添加地址失败';
    } catch (e) {
        response.status = failStatus;
        response.message = e.message;
    }

    res.json(response)
}

// 用户删除收货地址
controller.deladdress = async (req, res) => {
    var {
        address_id
    } = req.params;
    var sql = `delete from address where id=${address_id}`;

    try {
        var rows = await query(sql);
        response.status = rows.affectedRows ? 0 : 1;
        response.message = rows.affectedRows ? '添加删除成功' : '删除地址失败';
    } catch (e) {
        response.status = failStatus;
        response.message = e.message;
    }
    res.json(response)
}


// 用户编辑收货地址
controller.updateaddress = async (req, res) => {
    var {
        address_id
    } = req.params;
    var {
        name,
        tel,
        province,
        city,
        country,
        postalCode,
        isDefault,
        areaCode,
        user_id,
        addressDetail
    } = req.body;
    var isCorrent = true;
    isDefault = isDefault == 1 ? 1 : 0[address_id, name, tel, province, city, country, postalCode, user_id, addressDetail, areaCode].forEach(v => {
        if (!v) {
            isCorrent = false;
        }
    })

    if (!isCorrent) {
        res.json({
            status: 1,
            message: '参数错误，请检查'
        })
    } else {
        var sql = `update address set name='${name}', tel='${tel}', province='${province}', 
                city='${city}', country='${country}', 
                postalCode='${postalCode}', isDefault=${isDefault}, 
                areaCode='${areaCode}', addressDetail = '${addressDetail}',
                user_id='${user_id}', add_time=now()
                where id = ${address_id}
                `;
        // 修改默认收货地址
        var sql2 = "update address set is_default = 0 where id != ${address_id}";

        if (isDefault == 1) {
            query(sql2);
        }

        try {
            var rows = await query(sql);
            response.status = rows.affectedRows ? 0 : 1;
            response.message = rows.affectedRows ? '修改地址成功' : '修改地址失败';
        } catch (e) {
            response.status = failStatus;
            response.message = e.message;
        }

        res.json(response)
    }

}



controller.gentoken = (req, res) => {
    var token = genToken({
        username: 'admin',
        email: "admin@qq.com",
    }, 5)
    res.end(token);
}

controller.checktoken = (req, res) => {
    var {
        token
    } = req.query;
    var decoded = checkToken(token);
    if (decoded === false) {
        var response = {
            status: failStatus,
            message: '未登录'
        }
        res.status(401).json(response);
    } else {
        // 数据库检测用户 
        // to do...
        var response = {
            status: succStatus,
            message: 'ok'
        }
        res.json(response);
    }
}

// 用户提交订单
controller.commitorder = async (req, res) => {
    // 入库，操作，校验用户，订单金额
    var time = Math.floor(new Date().getTime() / 1000);
    var {
        user_id,
        order_id,
        address_id,
        total_price,
        number,
        goods_ids
    } = req.body;
    var isCorrent = true;
    [user_id, order_id, address_id, total_price, number, goods_ids].forEach(v => {
        if (!v) {
            isCorrent = false;
        }
    })
    if (!isCorrent) {
        res.json({
            status: 1,
            message: '参数错误，请检查'
        })
    } else {
        var orderData = {
            ...req.body,
            actual_price: 0.01,
            pay_way: "微信支付",
            status: 0,
            add_time: time
        }
        console.log('orderData', orderData);
        console.log('插入订单中。。。'); // to do...

        connect.query('INSERT INTO goods_order SET ?', orderData, async (error, results, fields) => {
            if (error) throw error;
            console.log('订单插入成功，唤起支付中...');
            //唤起微信支付 nodejs->h5=>url api http://vue.w0824.com/h5.php
            var php_h5_url = "http://vue.w0824.com/h5.php";
            try {
                axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                var {
                    data
                } = await axios.post(php_h5_url, orderData)
                console.log("weixinpayurl", data);
                res.json({
                    data
                })
            } catch (e) {
                res.json({
                    status: 1,
                    message: '支付失败，请稍后再试'
                })
            }


        });
    }



}


// 接收微信支付结果异步通知
controller.notify = (req, res) => {
    console.log('notify')
    var originJsonData = req.body.xml;
    var jsonData = {};
    for (const v in originJsonData) {
        jsonData[v] = originJsonData[v][0];
    }
    console.log('jsonData', jsonData)
    if (jsonData.result_code == 'SUCCESS') {
        console.log('SUCCESS')
        var key = "商户号";
        var stringA = "appid=" + jsonData.appid + "&bank_type=" + jsonData.bank_type + "&cash_fee=" + jsonData.cash_fee + "&fee_type=" + jsonData.fee_type +
            "&is_subscribe=" + jsonData.is_subscribe + "&mch_id=" + jsonData.mch_id + "&nonce_str=" + jsonData.nonce_str + "&openid=" +
            jsonData.openid + "&out_trade_no=" + jsonData.out_trade_no + "&result_code=" + jsonData.result_code + "&return_code=" +
            jsonData.return_code + "&time_end=" + jsonData.time_end + "&total_fee=" + jsonData.total_fee + "&trade_type=" +
            jsonData.trade_type + "&transaction_id=" + jsonData.transaction_id;
        var stringSignTemp = stringA + "&key=" + key;
        var sign = md5(stringSignTemp).toUpperCase();
        if (sign == jsonData.sign) {
            // 更新订单状态 to do...
            console.log('更新订单状态')
            var order_id = jsonData.out_trade_no;
            console.log("order_id", order_id)
            var sql = `update goods_order set status = 1, transaction_id='${jsonData.transaction_id}',openid='${jsonData.openid}' where order_id = '${order_id}'`;
            console.log("sql", sql)
            query(sql);
            //json转xml
            var json2Xml = function (json) {
                let _xml = '';
                Object.keys(json).map((key) => {
                    _xml += `<${key}>${json[key]}</${key}>`
                })
                return `<xml>${_xml}</xml>`;
            }
            var sendData = {
                return_code: 'SUCCESS',
                return_msg: 'OK'
            }
            res.end(json2Xml(sendData));
        }
    }
}

// 获取用户订单
controller.userorder = async (req, res) => {
    var user_id = parseInt(req.params.user_id);

    var response = {};
    if (!user_id) {
        res.json({
            status: 0,
            message: "参数有误"
        })
    } else {
        var sql = `select * from goods_order where user_id = ${user_id}`;
        var rows = await query(sql)
        response = rows;
        res.json(response)
    }

}

// 获取文章
controller.getarticle = async (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var pagesize = parseInt(req.query.pagesize) || 3;
    var offset = (page - 1) * pagesize;
    // 代表返回的数据结构
    var response = {
        code: 200,
        message: 'success'
    }
    var sql = "SELECT t1.*,t2.cat_name FROM le_article t1 left join le_category t2 on t1.cat_id = t2.id order by t1.id desc limit " + offset + ', ' + pagesize;
    var rows = await query(sql)
    rows.map(v=> v.img_url = getDomain() + v.img_url)
    response.data = rows;
    res.json(response)
}


// 获取文章
controller.getOneArticle = async (req, res) => {
    var id = parseInt(req.params.id) || 0;
    
    // 代表返回的数据结构
    var response = {
        code: 200,
        message: 'success'
    }
    var sql = `select * from le_article where id = ${id}`;
    var rows = await query(sql)
    rows.map(v => v.img_url = getDomain() + v.img_url)
    response.data = rows[0] || null;
    res.json(response)
}

// 删除文章
controller.delarticle = async (req, res) => {
    var {
        id
    } = req.body;
    console.log(req.body)
    var sql = `delete from le_article where id = ${id}`;
    var response = {};
    try {
        var rows = await query(sql);
        response.code = 200;
        response.message = rows.affectedRows ? '删除成功' : '删除失败';
    } catch (e) {
        response.code = 500;
        response.message = e.message;
    }
    res.json(response)
}

// 上传文件
controller.upload = (req,res) => {
    
    // console.log("file",req.file)
    var img_url = '';
    if(req.file){
        var extIndex = req.file.originalname.lastIndexOf('.');
        var ext =  req.file.originalname.substring(extIndex);
        var oldFile = path.join(__dirname,req.file.destination,req.file.filename)
        var newFile =  path.join(__dirname,req.file.destination,req.file.filename + ext);
        // 没有则uploads目录
        fs.rename(oldFile, newFile, (err) => {
            if (err) throw err;
            img_url = req.file.destination + req.file.filename + ext ;
            res.json({code:200,message:"upload success",img_url})
        })
       
    }else{
        res.json({code:200,message:"upload error",img_url})
    }
    
   
}

// 添加文章
controller.addarticle = async (req,res) => {
    var {title,cat_id,add_date,status,img_url,content} = req.body;
    status = status ? 1 : 0;
    var sql = `insert into  le_article(title,cat_id,status,add_date,content,img_url)
                values ('${title}','${cat_id}','${status}','${utc2Date(add_date)}','${content}','${img_url}')`
    var response = {};
    try {
        var rows = await query(sql);
        response.code = 200;
        response.message = 'add success';
    } catch (e) {
        response.message = e.message;
        response.code = 0;
    }
    res.json(response);
}


// 修改文章
controller.updArticle = async (req, res) => {
    var {
        title,
        cat_id,
        add_date,
        status,
        img_url,
        content
    } = req.body;
    status = status ? 1 : 0;
    // var sql = `insert into  le_article(title,cat_id,status,add_date,content,img_url)
    //             values ('${title}','${cat_id}','${status}','${utc2Date(add_date)}','${content}','${img_url}')`
    // var response = {};
    // try {
    //     var rows = await query(sql);
    //     response.code = 200;
    //     response.message = 'add success';
    // } catch (e) {
    //     response.message = e.message;
    //     response.code = 0;
    // }
    res.json(res.body);
}

controller.notFound = (req,res) => {
    res.json({
        code:0,
        message: "api路径错误，请检查"
    })
}

// 导出模块
module.exports = controller;