'use strict';

var _ = require('lodash');
var Build = require('./build.model');
var path = require('path');
var express = require('express');

exports.allBuilds = function(req, res) {
  Build.find({})
    .sort({
      createTime: -1
    })
    .exec(function(err, builds) {
      if (err) {
        return handleError(res, err);
      }
      if (!builds) {
        return res.send(404);
      }
      console.log(builds);
      return res.status(200)
                     .json(builds);
    });
};

exports.userBuilds = function(req, res) {
  var userEmail = req.query.email;
  Build.find({
    email: {
      $in: userEmail
    }
  })
  .sort({
    createTime: -1
  })
  .exec(function(err, builds) {
    if(err) {
      return handleError(res, err);
    }
    console.log(builds);
    return res.status(200)
                   .json(builds);
  });
};

exports.scrapeUpload = function(req, res) {
    var newBuild = new Build();
    newBuild.title = req.body.title;
    newBuild.image = req.body.image;
    newBuild.email = req.body.email;
    newBuild.linkURL = req.body.linkURL;
    newBuild.description = req.body.description;
    newBuild.userName = req.body.name;
    newBuild._creator = req.body._creator;
    newBuild.createTime = Date.now();
    newBuild.upVotes = 0;
    newBuild.save(function(err, item) {
      if (err) {
        console.log('error occured in saving post');
      } else {
        console.log('Success post saved');
        console.log(item);
        res.status(200)
          .json(item);
      }
    });
}

exports.upload = function(req, res) {
  var newBuild = new Build();
  console.log(req.body);
  newBuild.image = req.body.image;
  newBuild.email = req.body.email;
  newBuild.linkURL = req.body.linkURL;
  newBuild.title = req.body.title;
  newBuild.description = req.body.description;
  newBuild.userName = req.body.name;
  newBuild._creator = req.body._creator;
  newBuild.createTime = Date.now();
  newBuild.upVotes = 0;

  newBuild.save(function(err, build) {
    if(err) {
      console.log('error saving build');
      return res.send(500);
    } else {
      console.log(build);
      res.status(200)
           .send(build);
    }
  });
};

exports.singleBuild = function(req, res) {
  Build.findById(req.params.buildId, function(err, build) {
    if(err) {
      return handleError(res, err);
    }
    if(!build) {
      return res.send(404);
    }
    return res.json(build);
  });
};

exports.popBuilds = function(req, res) {
  Build.find(req.params.id)
    .sort('-upVotes')
    .limit(6)
    .exec(function(err, builds) {
      if (err) {
        return handleError(res, err);
      }
      console.log(builds);
      return res.json(builds);
    });
}

exports.update = function(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  Build.findById(req.params.id, function(err, build) {
    if(err) {
      return handleError(res, err);
      }
      if(!build) {
        return res.send(404);
      }
      var updated = _.merge(build, req.body);
      updated.save(function(err) {
        if(err) {
          return handleError(res, err);
        }
        console.log(build);
        return res.json(build);
      });
  });
};

exports.delete = function(req, res) {
  Build.findById(req.params.id, function(err, build) {
    if(err) {
      return handleError(res, err);
    }
    if(!build) {
      return res.send(404);
    }
    build.remove(function(err) {
      if(err) {
        return handleError(res, err);
      }
      return res.send(200);
    });
  });
};

exports.addView = function(req, res) {
  Build.findById(req.params.id, function(err, build) {
    if(err) {
      return handleError(res, err);
    }
    if (!build) {
      return res.send(404);
    }
    build.views++;
    build.save(function(err) {
      if (err) {
        return handle(res, err);
      }
      return res.json(build);
    });
  });
};

exports.addUpvote = function(req, res) {
  Build.findById(req.params.id, function(err, build) {
    if(err) {
      return handleError(res, err);
    }
    if(!build) {
      return res.send(404);
    }
    build.upVotes++;
    build.save(function(err) {
      if(err) {
        return handleError(res, err);
      }
      return res.json(build);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
