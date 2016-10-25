(function() {
  'use strict';

  angular
  .module('app')
  .config(config);

  config.$inject = ['$stateProvider'];

  function config($stateProvider) {
    $stateProvider
    .state('mybuilds', {
      url: '/mybuilds',
      templateUrl: 'app/myBuilds/myBuilds.html',
      controller: 'MyBuildsCtrl',
      authenticate: true
    });
  }

})();
