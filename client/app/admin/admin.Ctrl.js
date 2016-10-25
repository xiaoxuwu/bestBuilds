(function() {
  'use strict';

  angular
    .module('app')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['$scope', 'Auth', '$modal', 'adminAPI', '$alert', 'buildsAPI'];

  function AdminCtrl($scope, Auth, $modal, adminAPI, $alert, buildsAPI) {

    $scope.builds = [];
    $scope.users = [];
    $scope.user = {};
    $scope.editBuild = {};
    $scope.deleteBtn = true;

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

    adminAPI.getAllUsers()
      .then(function(data) {
        $scope.users = data.data;
      })
      .catch(function(err) {
        console.log('error getting users');
        console.log(err);
      });

    buildsAPI.getAllBuilds()
      .then(function(data) {
        console.log(data);
        $scope.builds = data.data;
      })
      .catch(function(err) {
        console.log('failed to get all builds');
      })

    $scope.deleteUser = function(user) {
      adminAPI.deleteUser(user)
        .then(function(data) {
          console.log('deleted user');
          var index = $scope.users.indexOf(user);
          $scope.users.splice(index, 1);
        })
        .catch(function(err) {
          console.log('failed to delete user');
          console.log(err);
        });
    }

    $scope.editBuild = function(build) {
      buildsAPI.getUpdateBuild(build)
        .then(function(data) {
          console.log(data);
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
          console.log(data);
          $scope.editBuild.title = '';
          $scope.editBuild.description = '';
          alertSuccess.show();
        })
        .catch(function(err) {
          console.log('failed to update' + err);
          alertFail.show();
        });
    }

    $scope.deleteBuild = function(build) {
      buildsAPI.deleteBuild(build)
        .then(function(data) {
          var index = $scope.builds.indexOf(build);
          $scope.editBuild.description = '';
          $scope.editBuild.title = '';
          $scope.deleteBtn = false;
          alertSuccess.show();
          $scope.builds.splice(index, 1);
          console.log('success, build deleted');
        })
        .catch(function(err) {
          alertFail.show();
          console.log('failed to delete build' + err);
        });
    }

  }
})();