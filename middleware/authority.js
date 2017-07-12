/**
 * Created by Administrator on 2017/7/9 0009.
 */
var koa = require('koa');
var sha1 = require('sha1');
var body = require('koa-body');
var getRawBody = require('raw-body');
var common = require('./common');
var GetAccessToken = require('../constructor/wechat');

module.exports = function (opts) {
   // var get_accessToken = new GetAccessToken(opts);

    return function *(next) {
        console.log(this.query);
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;

        var str = [token, timestamp, nonce].sort().join('');
        var sha = sha1(str);

        if (this.method === 'GET') {
            if (sha == signature) {
                this.body = echostr + '';
            }
            else {
                this.body = "wrong";
            }
        }

        else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = "wrong";
                return false
            }

            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '10mb',
                encoding: this.charset
            }); //跳到getRawBody,并等待其执行完毕，然后又跳回来

            var content = yield common.parseXMLAsync(data);
            //console.log(content);

            var message = common.formatMessage(content.xml);
            console.log(message)
        }

    }
};