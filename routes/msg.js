var crypto = require('crypto');

var Token  = 'yueb202am';

exports.token = function (req, res) {
    var shasum = crypto.createHash('sha1'),
        signature           = req.query.signature,
        echostr             = req.query.echostr,
        unencrypted_params  = [Token, req.query.timestamp, req.query.nonce].sort().join().replace(/,/g, ''),
        encrypted_str       = '';

    shasum.update(unencrypted_params) 

    encrypted_str = shasum.digest('hex')

    if (encrypted_str === signature) {
        res.send(encrypted_str)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}