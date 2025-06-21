var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var UserRouter = require('./routes/UserRouter');
var ActivityRouter = require('./routes/ActivityRouter');
var JoinRouter = require('./routes/JoinRouter');
var NavRouter = require('./routes/NavRouter');
var parser = require('body-parser'); // 导入parser
var cors = require('cors'); // 导入cors
var app = express();
app.use(cors()); // 解决跨域问题
app.use(parser.json({limit:'500kb'})); // 设置图片上传的容量
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(UserRouter)
app.use(ActivityRouter)
app.use(JoinRouter) // 使用这个路由
app.use(NavRouter) // 使用这个路由
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
