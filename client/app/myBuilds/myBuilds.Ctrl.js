(function() {
  'use strict';

  angular
    .module('app')
    .controller('MyBuildsCtrl', MyBuildsCtrl);

  MyBuildsCtrl.$inject = ['$scope', '$modal', '$state', '$alert', 'buildsAPI', 'Auth', '$document'];

  function MyBuildsCtrl($scope, $modal, $state, $alert, buildsAPI, Auth, $document) {

    $scope.user = Auth.getCurrentUser();
    var userEmail = $scope.user.email;

    $scope.userBuilds = [];
    $scope.editBuild = {};

    var alertSuccess = $alert({
      title: 'Saved ',
      content: 'Build has been edited',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    });

    var alertFail = $alert({
      title: 'Not Saved ',
      content: 'Build has failed to edit',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'warning',
      duration: 8
    });

    var myModal = $modal({
      scope: $scope,
      show: false
    });

    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    }

    $scope.noBuilds = function() {
      $scope.userBuilds.length === 0;
    }

    $scope.reload = function() {
      $state.reload();
    };

    buildsAPI.getUserBuilds(userEmail)
      .then(function(data) {
        $scope.userBuilds = data.data;
      })
      .catch(function(err) {
        console.log('failed to get builds for user ' + err);
      });

    $scope.editBuild = function(build) {
      buildsAPI.getUpdateBuild(build)
        .then(function(data) {
          $scope.editBuild = data.data;
        })
        .catch(function(err) {
          console.log('failed to edit build ' + err);
        });
    }

    $scope.saveBuild = function() {
      var build = $scope.editBuild;

      buildsAPI.updateBuild(build)
        .then(function(data) {
          console.log('Build updated');
          $scope.editBuild.title = '';
          $scope.editBuild.description = '';
          alertSuccess.show();
        })
        .catch(function(err) {
          console.log('failed to update' + err);
          alertFail.show();
        });
    }

    $scope.delete = function(build) {
      var index = $scope.userBuilds.indexOf(build);

      buildsAPI.deleteBuild(build)
        .then(function(data) {
          console.log('success, build deleted');
          $scope.userBuilds.splice(index, 1);
        })
        .catch(function(err) {
          console.log('failed to delete build' + err);
        });
    }

    $document.ready(function(){

    })
  }
})();
