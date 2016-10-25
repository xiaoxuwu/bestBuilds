var Comment = require('./comment.model');
var express = require('express');

exports.addComment = function(req, res) {
  var newComment = new Comment();
  newComment.author.id = req.body.authorId;
  newComment.author.name = req.body.authorName;
  newComment.author.email = req.body.authorEmail;
  newComment.gravatar = req.body.gravatar;
  newComment.comment = req.body.comment;
  newComment.buildId = req.body.buildId;
  newComment.createTime = Date.now();

  newComment.save(function(err, comment) {
    if (err) {
      console.log('error saving comment');
      return res.send(500);
    } else {
      res.status(200)
           .json(comment);
    }
  });
};

exports.getComments = function(req, res) {
  Comment.find({
    'buildId': req.params.id
  })
  .sort({
    createTime: -1
  })
  .exec(function(err, comments){
    if(err) {
      return res.send(500);
    }
    if(!comments) {
      return res.send(404);
    }
    return res.status(200)
                   .json(comments);
  });
}