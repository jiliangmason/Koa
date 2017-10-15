/**
 * Created by Administrator on 2017/10/15 0015.
 */
var ejs = require('ejs');
var heredoc = require('heredoc');

var tpl = heredoc(function () {
   /*<xml><ToUserName><![CDATA[<% toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<% fromUserName %>]]></FromUserName>
    <CreateTime><% createTime %></CreateTime>
    <MsgType><![CDATA[<% msgType %>]]></MsgType>
    <% if (msgType === 'text') { %>
        <Content><![CDATA[<%-content%>]]></Content></xml>
    <% } %>
    <% else if (msgType === 'image'){ %>
        <Image>
           <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
        </Image>
    <% } else if (msgType === 'voice') { %>
        <Voice>
            <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
        </Voice>
    <% } else if (msgType === 'video') { %>
        <Video>
            <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
            <Title><![CDATA[<% content.title %>]]></Title>
            <Description><![CDATA[<% content.description %>]]></Description>
        </Video>
    <% } else if (msgType === 'music') { %>
    <Music>
        <Title><![CDATA[<% content.title %>]]></Title>
        <Description><![CDATA[<% content.description %>]]></Description>
        <MusicUrl><![CDATA[<% content.musicUrl %>]]></MusicUrl>
        <HQMusicUrl><![CDATA[<% content.hqMusicUrl %>]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[<% content.ThumbMediaId %>]]></ThumbMediaId>
    </Music>
    <% } else if (msgType === 'news') {%>
        <ArticleCount><% content.length %></ArticleCount>
        <Articles>
            <% content.forEach(function(item) {%>
            <item>
                <Title><![CDATA[<% item.title %>]]></Title>
                <Description><![CDATA[<% item.description %>]]></Description>
                <PicUrl><![CDATA[<% item.picurl %>]]></PicUrl>
                <Url><![CDATA[<% item.url %>]]></Url>
            </item>
            <% }) %>
        </Articles>
    <% } %>
    */
});

var compile = ejs.compile(tpl);
exports = module.exports = {
    compile
};