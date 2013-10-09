var crypto = require('crypto'),
    xmlParseString = require('xml2js').parseString;

var Token  = 'yueb202am';

exports.config = function (req, res) {
    var shasum = crypto.createHash('sha1'),
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
    parse_req_xml_to_json(req, function(err, result) {
        res.send(result)
    })
}

function parse_req_xml_to_json(req, cb) {
    var body = '';

    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        body += chunk
    })

    req.on('end', function() {
        xmlParseString(body, function(err, result) {
            console.log(typeof result)
            cb(err, result)
        })
    })

}
