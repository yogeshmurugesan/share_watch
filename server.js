'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var log4js = require('log4js');
var path = require('path');
var morgan = require('morgan');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var singleWatchRoute = require('./routes/single_watch');
var marketWatchRoute = require('./routes/market_watch');
var logDirectory = path.join(__dirname, './logs');
var apiLogDirectory = path.join(__dirname, './logs/api');
var httpRequestLogDirectory = path.join(__dirname, './logs/http');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.existsSync(apiLogDirectory) || fs.mkdirSync(apiLogDirectory);
fs.existsSync(httpRequestLogDirectory) || fs.mkdirSync(httpRequestLogDirectory);

log4js.configure({
  appenders: {
    everything: { type: 'dateFile', filename: apiLogDirectory + '/error.log', maxLogSize: 10485760, pattern: '.yyyy-MM-dd' }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'error' }
  }
});
var errorLogger = log4js.getLogger();

var httpRequestLogStream = rfs('request.log', {
  interval: '1d', 
  path: httpRequestLogDirectory,
  size: '10M'
});

// Application settings
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './views');

app.locals.siteTitle = 'Share Watch app';

// Middlewares
app.use(morgan('combined', {
  stream: httpRequestLogStream
}));
// app.use('/static', express.static('./bower_components', {
//   index: false,
//   redirect: false
// }));

// Routes
app.use('/', singleWatchRoute);
app.use('/api/marketWatch', marketWatchRoute);
app.use(express.static(path.join(__dirname, 'assets/fonts')));
app.use(express.static(path.join(__dirname, 'assets/images')));
app.use(express.static(path.join(__dirname, 'assets/javascripts')));
app.use(express.static(path.join(__dirname, 'assets/stylesheets')));
app.use(express.static(path.join(__dirname, 'views')));


// Middleware for error handler
app.use(function(err,req,res,next) {
  res.status(500);
  errorLogger.error(err);
  res.send({"Error": {}});
});


server.listen(process.env.PORT || 3000);
