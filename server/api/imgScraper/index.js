'use strict';

// var controller = require('./build.controller');
var controller = require('./imgScraper.controller');
var express = require('express');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/scrape', auth.isAuthenticated(), controller.scrape);

module.exports = router;