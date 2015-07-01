var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect('mongodb://passport:passport@192.168.112.94:27017/passport');
var MongoStore = require('connect-mongo')(session);
var app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'passportsession',
    key: 'mxc',//cookie name
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}//30 days
}));


var ejs = require('ejs');


// view engine setup
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


var index = require('./routes/index');
var login = require('./routes/login');
var token = require('./routes/token');

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length, Authorization, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    next();
});

app.use('/', index);
app.use('/login', login);
app.use('/token', token);

var Token = require('./db/token.js');
var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
var times = [];
for(var i=1; i<60; i++){
    times.push(i);
}
rule.minute = times;
schedule.scheduleJob(rule, function(){
    Token.delExpiredToken(new Date());
});

module.exports = app;