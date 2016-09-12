(function() {
  'use strict';

  angular
  .module('app')
  .config(config);

  config.$inject = ['$stateProvider'];

  function config($stateProvider) {
    $stateProvider
    .state('mylooks', {
      url: '/mybuilds',
      templateUrl: 'app/myLooks/myLooks.html',
      controller: 'MyLooksCtrl',
      authenticate: true
    });
  }

})();
