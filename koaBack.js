/**
 * Created by Administrator on 2017/6/18 0018.
 */
var Koa = require('koa');
var xss = require('xss');

var app = new Koa();
app.use(function *(next) {
    console.log(this.query);
    var echo = this.query.echo;
    var _head = '<!DOCTYPE html><html><head><title>回声机</title></head><body><span style="color:#ff6600; border:1px solid #ddd;">';
    var _body = '</span></body></html>';

    if (!echo) {
        this.body = _head + "没有内容 mmp~~" + _body;
    }
    else {
        echo = xss(echo, {});
        this.body = _head + echo + _body;
    }
});

app.listen(3000);
console.log('Listening port 3000');