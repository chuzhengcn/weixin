var crypto = require('crypto'),
    shasum = crypto.createHash('sha1');

var Token  = 'yueb202am';

exports.token = function (req, res) {
    var signature       = req.query.signature,
        nonce           = req.query.nonce,
        timestamp       = req.query.timestamp,
        echostr         = req.query.echostr,
        encrypted_str   = '';

    // token、timestamp、nonce三个参数要进行字典序排序  
    shasum.update(nonce + timestamp + Token) 

    encrypted_str = shasum.digest('hex')

    if (encrypted_str === signature) {
        res.send(encrypted_str)
    } else {
        res.send({ok : 0, msg : '验证失败'})        
    }
}