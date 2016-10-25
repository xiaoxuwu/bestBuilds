'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

exports.list = function (url, cb) {
  //this is the actual request to the pinterest page I care about
  request(url, function (error, resp, body) {
    if (error) {
      cb({
        error: error
      });
    }
    if (!error) {
      var $ = cheerio.load(body);
      var $url = url;
      var $img = $('.post-image img').attr('src');
      var $desc = $('.post-image img').attr('alt');

      console.log($img + ' image url');

      //Finding the bits on the page we care about based on class names
      var image = {
        img: "http:" + $img,
        url: $url,
        desc: $desc
      }

      //respond with the final json
      cb(image);
    }
  });
}
