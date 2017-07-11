# Koa

## 1. 关于如何获取微信的access_token:
1、建议公众号开发者使用中控服务器统一获取和刷新Access_token，其他业务逻辑服务器所使用的access_token均来自于该中控服务器，不应该各自去刷新，否则容易造成冲突，导致access_token覆盖而影响业务；<br>
2、目前Access_token的有效期通过返回的expire_in来传达，目前是7200秒之内的值。中控服务器需要根据这个有效时间提前去刷新新access_token。在刷新过程中，中控服务器对外输出的依然是老access_token，此时公众平台后台会保证在刷新短时间内，新老access_token都可用，这保证了第三方业务的平滑过渡；

## 2. 接口：
https请求方式: GET <br>
https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET <br>
![image](https://github.com/jiliangmason/Koa/blob/master/note/access.png)

### 3. 传入的config：
```
config = {
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
```

readFileAsync和writeFileAsync是对fs.readFile和writeFile的封装，返回一个Promise对象 <br />
之后，拿到票据后判断是否过期，过期更新，否则将其保存在指定的文件中：
```
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
            
.then(function (data) {
            _this.access_token = data.access_token;
            _this.expires_in = data.expires_in;
            _this.saveAccessToken(data)
        })
 ```
 
 更新票据：
 ```
 var url = config.access_token + `&appid=${appID}&secret=${secret}`; //请求
    return new Promise(function (resolve, reject) {
        request({url: url, json: true}) //request是promisefy=>promise对象
            .then(function (response) {
                var data = response[1];
                var now = (new Date().getTime());
                var expires_in = now + (data.expires_in - 20)*1000; //提前20s刷新

                data.expires_in = expires_in;
                resolve(data);
            });
    });
```
