/**
 * Created by Administrator on 2017/7/11 0011.
 */
var xml2js = require('xml2js');
var Promise = require('bluebird');

exports.parseXMLAsync = function (xml) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, {trim: true}, function (err, content) {
            if (err) reject(err);
            else {
                resolve(content)
            }
        })
    })
};

//handle xml 嵌套
function formatData(result) {
    var message = {};

    if (typeof result === 'object') {
        var keys = Object.keys(result);
        for (var i=0; k=keys.length, i < k; i++) {
            var value = result[keys[i]];
            var key = keys[i];

            if (!Array.isArray(value) || value.length == 0) {
                continue;
            } //not an array

            if (value.length == 1) {
                var val = value[0];
                if (typeof val === 'object') {
                    message[key] = formatData(val);
                }
                else {
                    message[key] = (val || '').trim();
                }
            } //single
            else {
                message[key] = [];
                for (var j=0; j < value.length;j++) {
                    message[key].push(formatData(value[j]));
                }
            } //an array contains a lot elements

        }
    }

    return message;
}

exports.formatMessage = function (xml) {
    return formatData(xml)
};