'use strict';

angular.module('app')
  .controller('NavbarCtrl', function ($state, $scope, $location, Auth, looksAPI) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.user = Auth.getCurrentUser();
    var userEmail = $scope.user.email;

    if(userEmail) {
    looksAPI.getUserLooks(userEmail)
      .then(function(data) {
        console.log(data);
        $scope.userLooks = data.data;
      })
      .catch(function(err) {
        console.log('failed to get builds for user ' + err);
      });
    }
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
