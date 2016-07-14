var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var config = require('./config')

var app = express();

// io stuff
var io = require('socket.io')();
app.io = io;
var routes = require('./routes/index')(io);

// parseServer stuff
var ParseServer = require('parse-server').ParseServer;

// Config the parse server settings
//
var parseAPI = new ParseServer({ databaseURI: 'mongodb://BriaWoods:achays360@ds047315.mlab.com:47315/glo',
    cloud: './cloud/main.js',
    verifyUserEmails: false,
    appName: 'GLO',
    appId: process.env.APP_ID || '3DSGLOBALROUNDUP',
    fileKey: process.env.FILE_KEY || 'myFileKey',
    masterKey: process.env.MASTER_KEY || config.secret,
    serverURL: process.env.SERVER_URL || 'https://glo-app.heroku.com/parse', //previously https://log-log.herokuapp.com/parse
    // publicServerURL: 'http://log-log.lol/parse', //process.env.SERVER_URL
});

app.use('/parse', parseAPI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://BriaWoods:achays360@ds047315.mlab.com:47315/glo');

app.use('/', routes);
app.use('/users', users);

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
