let moment = require('moment');
module.exports = {
    log(value){
        console.log(value);
    },
    genOrderId(){
        var randomNumber = ""; //订单号
        for (var i = 0; i < 6; i++) { //6位随机数，用以加在时间戳后面。
        
            randomNumber += Math.floor(Math.random() * 10);
        }
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        const formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
        }

        return [year, month, day, hour, minute, second].map(formatNumber).join('') + randomNumber;
    },

    utc2Date(date,format = "YYYY-MM-DD hh:mm:ss"){
        return moment(date).format(format)
    },

    getDomain(){
        return "http://127.0.0.1:3000/";
    }

}