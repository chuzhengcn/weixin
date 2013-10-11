function send_err(res, err) {
    res.send({ok : 0, msg : JSON.stringify(err)})
}

exports.send_err = send_err

function parse_req_xml_to_json(req, cb) {
    var body = '';

    req.setEncoding('utf8');

    req.on('data', function(chunk) {
        body += chunk
    })

    req.on('end', function() {
        parseXmlString(body, cb)
    })
}

exports.parse_req_xml_to_json = parse_req_xml_to_json

function reply_by_xml_type(res, xml_str) {
    res.type('xml')
    res.send(xml_str)
}

exports.reply_by_xml_type = reply_by_xml_type
