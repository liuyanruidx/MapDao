var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');//Express 3.X 版本以后需要使用才可以支持Layout

var AV = require('leanengine');

var cloud = require('./cloud');
var routes = require('./routes/index');
var users = require('./routes/users');

var roads = require('./routes/roads');
var points = require('./routes/points');
var company = require('./routes/company');
var help = require('./routes/help');
var invitation = require('./routes/invitation');

var todos = require('./routes/todos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(partials());
// 加载云代码方法
app.use(cloud);
// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({ secret: '05XgTktKPMkU', maxAge: 3600000, fetchUser: true }));


//app.get('/', function(req, res) {
//  res.render('index', { currentTime: new Date() })
//})
app.use('/', routes);
app.use('/users', users);
app.use('/roads', roads);
app.use('/points', points);
app.use('/help', help);
app.use('/company', company);
app.use('/invitation', invitation);

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
