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
  var resultPromises = [];
  var completeResultPromise = Q.defer();
  var completeResult = {};
  var stocks = [
    {
      name: "KARURVYSYA",
      market: "NSE"
    },
    {
      name: "APEX",
      market: "NSE"
    },
    {
      name: "CASTROLIND",
      market: "NSE"
    },
    {
      name: "RAMCOSYS",
      market: "NSE"
    },
    {
      name: "YESBANK",
      market: "NSE"
    },
    {
      name: "JISLJALEQS",
      market: "NSE"
    }
  ];
  _.each(stocks, function(stock, index, list){
    var resultPromise = marketWatchService.getMarketDepth(stock);
    resultPromises.push(resultPromise);
  });
  Q.allSettled(resultPromises).then(function(results) {
    _.each(results, function(result){
      var key = _.keys(result.value)[0];
      var value = result.value[_.keys(result.value)[0]];
      completeResult[key] = value;
    });
    completeResultPromise.resolve();
  });
  completeResultPromise.promise.then(function() {
    res.json(completeResult);
    res.end();
  });
});

module.exports = router;
