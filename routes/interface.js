var crypto = require('crypto'),
    util   = require('util'),
    async  = require('async'),
    helper = require('../helper');

var Token  = 'yueb202am';

var reply_type_dict = {
    'text' : reply_by_text,
}

exports.config = function (req, res) {
    var shasum              = crypto.createHash('sha1'),
        signature           = req.query.signature,
        echostr             = req.query.echostr,
        unencrypted_params  = [Token, req.query.timestamp, req.query.nonce].sort().join().replace(/,/g, ''),
        encrypted_str       = '';

    shasum.update(unencrypted_params) 

    encrypted_str = shasum.digest('hex')

    if (encrypted_str === signature) {
        res.send(echostr)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}

exports.receive_reply_msg = function(req, res) {
    helper.parse_req_xml_to_json(req, function(err, result) {
        if (err) {
            return helper.send_err(res, err)
        }

        var msg = get_user_msg_info(result)

        if (!reply_type_dict[msg.msg_type]) {
            return helper.send_err(res,'不支持的回复类型')
        }

        // 最后一个参数是计算结果的函数数组
        reply_type_dict[msg.msg_type](res, msg, [text_step_1(msg.content)])
    })
}

function reply_by_text(res, msg, generate_result_func_arry) {
    var reply_content  ='<xml>' +
                            '<ToUserName><![CDATA[%s]]></ToUserName>' +
                            '<FromUserName><![CDATA[%s]]></FromUserName>' +
                            '<CreateTime>%d</CreateTime>' +
                            '<MsgType><![CDATA[text]]></MsgType>' +
                            '<Content><![CDATA[%s]]></Content>' + 
                        '</xml>';

    async.waterfall(generate_result_func_arry, function(err, result) {
        reply_content = util.format(reply_content, msg.from_user_name, msg.to_user_name, Date.now(), result)
        helper.reply_by_xml_type(res, reply_content)
    })
}

function get_user_msg_info(xml_msg) {
    var msg = xml_msg.xml

    return {

        // common
        'to_user_name' : msg.ToUserName[0],
        'from_user_name' : msg.FromUserName[0],
        'create_time' : msg.CreateTime[0],
        'msg_type' : msg.MsgType[0],
        'msg_id' : msg.MsgId[0],

        // text
        'content' : (msg.Content && msg.Content[0]) || '',

        // pic
        'pic_url' : (msg.PicUrl && msg.PicUrl[0]) || '',

        // location
        'location_x' : (msg.Location_X && msg.Location_X[0]) || '',
        'location_y' : (msg.Location_Y && msg.Location_Y[0]) || '',
        'scale' : (msg.Scale && msg.Scale[0]) || '',
        'label' : (msg.Label && msg.Label[0]) || '',

        // link
        'title' : (msg.Title && msg.Title[0]) || '',
        'description' : (msg.Location_Y && msg.Description[0]) || '',
        'url' : (msg.Url && msg.Url[0]) || '',

        // event
        'event' : (msg.Event && msg.Event[0]) || '',
        'event_key' : (msg.EventKey && msg.EventKey[0]) || '',
    }
}

function text_step_1(text) {
    text = '我是外交部复读机：' + text;

    return function(callback) {
        callback(null, text)
    }
}