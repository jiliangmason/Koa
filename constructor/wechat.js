/**
 * Created by Administrator on 2017/7/11 0011.
 */
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var prefix = 'https://api.weixin.qq.com/';
var config = {
    access_token: prefix + 'cgi-bin/token?grant_type=client_credential'
};

//获取新的票据，2小时过期
function GetAccessToken(opts) {
    var _this = this;
    this.appID = opts.appID;
    this.secret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    return this.getAccessToken() //Promise data是一个字符串
        .then(function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return _this.updateAccessToken(); //出错更新票据
            }

            if (_this.isValidAccessToken(data)) { //是否过期

                Promise.resolve(data); //返回一个Promise对象，该对象是被决议(resolve)的
            }
            else {
                return _this.updateAccessToken();
            }
        })
        .then(function (data) {
            _this.access_token = data.access_token;
            _this.expires_in = data.expires_in;
            _this.saveAccessToken(data)
        })
}

GetAccessToken.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }

    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = new Date().getTime();
    if (now < expires_in) {
        return true
    }
    else {
        return false
    }

};

GetAccessToken.prototype.updateAccessToken = function () {
    var appID= this.appID;
    var secret = this.secret;
    var url = config.access_token + `&appid=${appID}&secret=${secret}`;

    return new Promise(function (resolve, reject) {
        request({url: url, json: true})
            .then(function (response) {
                var data = response[1];
                //console.log(data);
                var now = (new Date().getTime());
                var expires_in = now + (data.expires_in - 20)*1000; //提前20s刷新

                data.expires_in = expires_in;
                resolve(data);
            });
    });

};

module.exports = GetAccessToken;
