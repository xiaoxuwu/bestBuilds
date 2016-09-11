'use strict';

var request = require('request');
var cheerio = require('cheerio');

exports.list = function(url, cb) {
  request(url, function(error, resp, body) {
    if(error) {
      cb({
        error: error
      });
    }
    if(!error){
      var $ = cheerio.load(body);
      var pin = {};
      var $url = url;
      var $img = $('.heightContainer img').attr('src');
      var $desc = $('.heightContainer img').attr('alt');

      console.log($img + ' pin url');

      var pin = {
        img: $img,
        url: $url,
        desc: $desc
      }

      // respond with the final JSON object
      cb(pin);
    }
  });
}