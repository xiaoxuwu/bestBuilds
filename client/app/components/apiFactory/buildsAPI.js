(function() {
  'use strict';

  angular
    .module('app')
    .factory('buildsAPI', buildsAPI);

    buildsAPI.$inject = ['$http'];

    function buildsAPI($http) {
      return {
        createScrapeBuild: createScrapeBuild,
        getAllBuilds: getAllBuilds,
        getUserBuilds: getUserBuilds,
        findOneBuild: findOneBuild,
        getUpdateBuild: getUpdateBuild,
        updateBuild: updateBuild,
        popBuilds: popBuilds,
        deleteBuild: deleteBuild,
        upVoteBuild: upVoteBuild,
        addView: addView
      }

      function createScrapeBuild(build) {
        return $http.post('/api/build/scrapeUpload', build);
      }

      function getAllBuilds() {
        return $http.get('/api/build/getAllBuilds', {
          cache: false
        });
      }

      function getUserBuilds(id) {
        return $http.get('/api/build/getUserBuilds/?email=' + id, {
          cache: false
        });
      }

      function findOneBuild(build) {
        return $http.get('/api/build/' + build);
      }

      function popBuilds(build) {
        return $http.get('/api/build/popBuilds/' + build);
      }

      function getUpdateBuild(build) {
        return $http.get('/api/build/' + build._id);
      }

      function updateBuild(build) {
        return $http.put('/api/build/' + build._id, build);
      }

      function deleteBuild(build) {
        return $http.delete('/api/build/' + build._id);
      }

      function upVoteBuild(build) {
        return $http.put('/api/build/upvote/' + build._id);
      }

      function addView(build) {
        return $http.put('/api/build/view/' + build);
      }

    }
})();
