'use strict';

var express = require('express');
var request = require('request');
var _ = require("underscore");
var Q = require('q');
var BASE_URL = "https://newtrade.sharekhan.com/wcs.sk?e=141&mid=5";

module.exports.getMarketDepth = function(stock) {
  var def = Q.defer();
  var result = {};
  var options = {
    url: BASE_URL + "&ex=" + stock["market"] + "&s=" + stock["name"]
  };
  request(options, function (error, response, body) {
    if (error){
      def.resolve(null);
    } else {
      result[stock["name"] + "-" + stock["market"]] = JSON.parse(body);
      def.resolve(result);
    }
  });
  return def.promise;
}



