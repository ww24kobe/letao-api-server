const jwt = require('jsonwebtoken');
const secret = "%^^&GTUYH&*";
var tokenTool = {};
tokenTool.genToken = (data, exprire = 10) => {
    var now = Math.floor(new Date().getTime() / 1000); // 当前时间秒数
    var expire = now + 24 * 3600 * exprire; // 10天
    var payload = {
        iss: data,
        iat: now,
        exp: expire
    };
    var token = jwt.sign(payload, secret);
    return token;
}

tokenTool.checkToken = (originToken) => {
    try{
        var decoded = jwt.verify(originToken, secret);
        return decoded;
        // return true;
    }catch(e){
        return false;
    }
}

module.exports = tokenTool;
