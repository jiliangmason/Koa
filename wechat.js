/**
 * Created by Administrator on 2017/6/14 0014.
 */
'use strict';
var koa = require('koa');
var sha1 = require('sha1');
var path = require('path');
var auth = require('./middleware/authority');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat_file.txt');

var config = {
    wechat: {
        appID: 'wx020ce76cdb4f6154',
        appSecret: 'cb43dcf53e37887a034b7f25efe8e368',
        token: 'jiliangmason',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file, data);
        }
    }
};

var app = new koa();

app.use(auth(config.wechat));

app.listen(80);
console.log('Listening port 80');

