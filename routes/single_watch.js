'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var Q = require('q');
var marketWatchService = require('../services/market_watch');
var config = require('config');
var _ = require("underscore");
var router = express.Router();

// Middlewares
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var text_plain_parser = bodyParser.text({ type: 'text/plain' });

// Routes
router.get('/', function(req, res) {
  res.render('layout', {title: "Share Watch App"});
});

router.get('/singleWatch', function(req, res) {
  var stock = {
    name: req.query.name,
    market: req.query.market
  };
  var resultPromise = marketWatchService.getMarketDepth(stock);
  resultPromise.then(function(response) {
    res.json(response);
    res.end();
  });
});

module.exports = router;
