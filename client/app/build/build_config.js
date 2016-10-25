(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
      $stateProvider
        .state('build', {
          url: '/build/:buildId',
          templateUrl: 'app/build/build_detail_view.html',
          controller: 'BuildCtrl'
        });
    }
})();
