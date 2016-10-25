'use strict';

var controller = require('./build.controller');
var express = require('express');
var router = express.Router();
var auth = require('../../auth/auth.service');

router.post('/scrapeUpload', auth.isAuthenticated(), controller.scrapeUpload);
router.post('/upload', auth.isAuthenticated(), controller.upload);

router.put('/upvote/:id', auth.isAuthenticated(), controller.addUpvote);
router.put('/view/:id', controller.addView);

router.put('/:id', auth.isAuthenticated(), controller.update);

router.get('/getAllBuilds', controller.allBuilds);
router.get('/getUserBuilds', controller.userBuilds);

router.get('/:buildId', controller.singleBuild);
router.get('/popBuilds/:id', controller.popBuilds);

router.delete('/:id', controller.delete);

module.exports = router;