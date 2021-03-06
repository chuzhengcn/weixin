//-----------------------------Module dependencies------------------------------
var express = require('express')
var http    = require('http')
var path    = require('path')
var stylus  = require('stylus')
//-----------------app-------------------------------------------------------
var app = express()

app.configure(function(){
    app.set('port', process.env.PORT || 3000)
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'))
    app.use(express.logger('dev'))
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname }))
    app.use(express.methodOverride())
    // app.use(express.cookieParser('weixin'))
    // app.use(express.cookieSession({key : 'weixin'}))
    app.use(app.router)
    app.use(stylus.middleware({src: path.join(__dirname, 'public')}))
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(express.errorHandler())
})

app.configure('development', function(){
})

app.configure('production', function(){
})
//-----------------------route-----------------------------------
var weixin_interface = require('./routes/interface')
app.get('/interface', weixin_interface.config)
app.post('/interface', weixin_interface.receive_reply_msg)

//---------------------------------------------------------------
http.createServer(app).listen(app.get('port'), function(){
    console.log("weixin server listening on port " + app.get('port'))
})
