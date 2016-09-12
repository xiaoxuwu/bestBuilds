(function() {
  'use strict';

  angular
    .module('app')
    .controller('MyLooksCtrl', MyLooksCtrl);

  MyLooksCtrl.$inject = ['$scope', '$modal', '$state', '$alert', 'looksAPI', 'Auth'];

  function MyLooksCtrl($scope, $modal, $state, $alert, looksAPI, Auth) {

    $scope.user = Auth.getCurrentUser();
    var userEmail = $scope.user.email;

    $scope.userLooks = [];
    $scope.editLook = {};

    var alertSuccess = $alert({
      title: 'Saved ',
      content: 'Look has been edited',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    });

    var alertFail = $alert({
      title: 'Not Saved ',
      content: 'Look has failed to edit',
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

    $scope.noLooks = function() {
      $scope.userLooks.length === 0;
    }

    $scope.reload = function() {
      $state.reload();
    };

    looksAPI.getUserLooks(userEmail)
      .then(function(data) {
        console.log(data);
        $scope.userLooks = data.data;
      })
      .catch(function(err) {
        console.log('failed to get builds for user ' + err);
      });

    $scope.editLook = function(look) {
      looksAPI.getUpdateLook(look)
        .then(function(data) {
          console.log(data);
          $scope.editLook = data.data;
        })
        .catch(function(err) {
          console.log('failed to edit build ' + err);
        });
    }

    $scope.saveLook = function() {
      var look = $scope.editLook;

      looksAPI.updateLook(look)
        .then(function(data) {
          console.log('Look updated');
          console.log(data);
          $scope.editLook.title = '';
          $scope.editLook.description = '';
          alertSuccess.show();
        })
        .catch(function(err) {
          console.log('failed to update' + err);
          alertFail.show();
        });
    }

    $scope.delete = function(look) {
      var index = $scope.userLooks.indexOf(look);

      looksAPI.deleteLook(look)
        .then(function(data) {
          console.log('success, build deleted');
          $scope.userLooks.splice(index, 1);
        })
        .catch(function(err) {
          console.log('failed to delete build' + err);
        });
    }
  }
})();
