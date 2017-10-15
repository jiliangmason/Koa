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
    var get_accessToken = new GetAccessToken(opts);

    return function* (next) {
        //console.log(this.query);
        let token = opts.token;
        let signature = this.query.signature;
        let nonce = this.query.nonce;
        let timestamp = this.query.timestamp;
        let echostr = this.query.echostr;

        let str = [token, timestamp, nonce].sort().join('');
        let sha = sha1(str);

        if (this.method === 'GET') {
            if (sha === signature) {
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

            let data = yield getRawBody(this.req, {
                length: this.length,
                limit: '10mb',
                encoding: this.charset
            }); //跳到getRawBody,并等待其执行完毕，然后又跳回来

            let content = yield common.parseXMLAsync(data);
            console.log(content);

            let message = common.formatMessage(content.xml);
            console.log(message);

/*            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    let now = new Date().getTime();
                    this.status = 200;
                    this.type = 'application/xml';

                    let reply = `<xml><ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                                    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                                    <CreateTime>${now}</CreateTime>
                                    <MsgType><![CDATA[text]]></MsgType>
                                    <Content><![CDATA[你好]]></Content></xml>`;
                    console.log(reply);
                    this.body = reply;

                    return

                }
            }*/
            this.weixin = message;
            yield handler.call(this, next);

            get_accessToken.replay.call(this);
        }

    }
};