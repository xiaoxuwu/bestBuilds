(function() {
  'use strict';

  angular
    .module('app')
    .controller('BuildCtrl', BuildCtrl);

  BuildCtrl.$inject = ['$scope', '$stateParams', 'buildsAPI', 'commentAPI', 'Auth'];

  function BuildCtrl($scope, $stateParams, buildsAPI, commentAPI, Auth) {

    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.id = $stateParams.buildId;
    $scope.popBuilds = [];

    buildsAPI.findOneBuild($scope.id)
      .then(function(data) {
        console.log(data);
        $scope.build = data.data;
        addView();
      })
      .catch(function(err) {
        console.log('failed to get build ', err);
      });

    buildsAPI.popBuilds($scope.id)
      .then(function(data) {
        console.log(data);
        $scope.popBuilds = data.data;
      })
      .catch(function(err) {
        console.log('failed to get pop build ', err);
      });

    commentAPI.getComments($scope.id)
      .then(function(data) {
        console.log(data);
        $scope.comments = data.data;
      })
      .catch(function(err) {
        console.log('failed to get comments ' + err);
      });

    $scope.addVote = function(build) {
      buildsAPI.upVoteBuild(build)
        .then(function(data) {
          console.log(data);
          build.upVotes++;
        })
        .catch(function(err) {
          console.log('failed adding upvote ');
        });
    }

    $scope.postComment = function() {
      var comment = {
        authorId: $scope.user._id,
        authorName: $scope.user.name,
        authorEmail: $scope.user.email,
        gravatar: $scope.user.gravatar,
        comment: $scope.comment.body,
        buildId: $scope.id
      }
      commentAPI.addComment(comment)
        .then(function(data) {
          console.log(data);
          $scope.comment.body = '';
          $scope.comments.splice(0, 0, data.data);
        })
        .catch(function(err) {
          console.log('failed to post comment ' + err);
        })
    }

    function addView() {
      buildsAPI.addView($scope.id)
        .then(function(res) {
          console.log('view added to Build');
          console.log(res);
        })
        .catch(function(err) {
          console.log('failed to increment ', err);
        });
    }

  }
})();
