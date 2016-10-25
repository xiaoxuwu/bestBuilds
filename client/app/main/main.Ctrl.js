(function() {
  'use strict';

  angular
  .module('app')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'scrapeAPI', '$http', '$alert', 'buildsAPI', 'Upload'];

  function MainCtrl($scope, $state, Auth, $modal, scrapeAPI, $http, $alert, buildsAPI, Upload) {
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    var userEmail = $scope.user.email;

    $scope.build = {};
    $scope.builds = [];
    $scope.scrapePostForm = true;
    $scope.showScrapeDetails = false;
    $scope.gotScrapeResults = false;
    $scope.loading = false;

    $scope.picPreview = true;
    $scope.uploadBuildTitle = true;
    $scope.uploadBuildForm = false;

    $scope.busy = true;
    $scope.allData = [];
    var page = 0;
    var step = 3;

    var alertSuccess = $alert({
      title: 'Success! ',
      content: 'New Build added',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    })

    var alertFail = $alert({
      title: 'Not saved',
      content: 'New Build failed to save',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'warning',
      duration: 8
    })

    var myModal = $modal({
      scope: $scope,
      show: false
    });

    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    }

    if(userEmail) {
      buildsAPI.getUserBuilds(userEmail)
      .then(function(data) {
        $scope.userBuilds = data.data;
      })
      .catch(function(err) {
        console.log('failed to get builds for user ' + err);
      });
    }

    $scope.reload = function() {
      $state.reload();
    };

    buildsAPI.getAllBuilds()
    .then(function(data) {
      console.log('builds found ');
      // $scope.builds = data.data;
      $scope.builds = data.data;
      //$scope.nextPage();
      $scope.busy = false;
    })
    .catch(function(err) {
      console.log('failed to get builds ' + err);
    });

    // $scope.nextPage = function() {
    //   var buildLength = $scope.builds.length;
    //   if($scope.busy) {
    //     return;
    //   }
    //   $scope.busy = true;
    //   $scope.builds = $scope.builds.concat($scope.allData.splice(page * step, step));
    //   page++;
    //   $scope.busy = false;
    //   if($scope.builds.length === 0) {
    //     $scope.noMoreData = true;
    //   }
    // };

    $scope.showUploadForm = function() {
      $scope.uploadBuildForm = true;
      $scope.scrapePostForm = false;
      $scope.uploadBuildTitle = false;
    }

    // Watch for changes to URL, Scrape and Display the image
    $scope.$watch("build.link", function(newVal, oldVal) {
      if (newVal && newVal.length > 5) {
        $scope.loading = true;
        var link = {
          url: $scope.build.link
        }
        scrapeAPI.getScrapeDetails(link)
        .then(function(data) {
          $scope.showScrapeDetails = true;
          $scope.gotScrapeResults = true;
          $scope.uploadBuildTitle = false;
          $scope.build.imgThumb = data.data.img;
          $scope.build.description = data.data.desc;
        })
        .catch(function(data) {
          console.log('failed to return from scrape');
          $scope.loading = false;
          $scope.build.link = '';
          $scope.gotScrapeResults = false;
        })
        .finally(function() {
          $scope.loading = false;
          $scope.uploadBuildForm = false;
        });
      }
    });

    $scope.addVote = function(build) {

      buildsAPI.upVoteBuild(build)
      .then(function(data) {
        build.upVotes++;
      })
      .catch(function(err) {
        console.log('failed adding upvote ');
      });
    }

    $scope.addScrapePost = function() {
      var build = {
        description: $scope.build.description,
        title: $scope.build.title,
        image: $scope.build.imgThumb,
        linkURL: $scope.build.link,
        email: $scope.user.email,
        name: $scope.user.name,
        _creator: $scope.user._id
      }
      buildsAPI.createScrapeBuild(build)
      .then(function(data) {
        console.log('posted from frontend success');
        alertSuccess.show();
        $scope.showScrapeDetails = false;
        $scope.gotScrapeResults = false;
        $scope.build.title = '';
        $scope.build.link = '';
        $scope.builds.splice(0, 0, data.data);
      })
      .catch(function() {
        console.log('failed to post from frontend ');
        $scope.showScrapeDetails = false;
        alertFail.show(); // for our fail alert
      });
    }

    $scope.$watch('searchTxt', function (val) {
      var buildsPulled;
      buildsAPI.getAllBuilds()
      .then(function(data) {
        buildsPulled = data.data;
        val = val.toLowerCase();
        $scope.builds = buildsPulled.filter(function (obj) {
            return obj.title.toLowerCase().indexOf(val) != -1;
        });
      })
      .catch(function(err) {
        console.log('failed to get builds ' + err);
      });
    });

    /* NOT SUPPORTED ON HEROKU
    $scope.uploadPic = function(file) {
    Upload.upload({
    url: '/api/build/upload',
    headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: {
  file: file,
  title: $scope.build.title,
  description: $scope.build.description,
  email: $scope.user.email,
  name: $scope.user.name,
  linkURL: $scope.build._id,
  _creator: $scope.user._id
}
}).then(function(resp) {
console.log('success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
$scope.builds.splice(0, 0, resp.data);
$scope.build.title = '';
$scope.build.description = '';
$scope.picFile = '';
$scope.picPreview = false;
alertSuccess.show();
}, function(resp) {
alertFail.show();
}, function(evt) {
var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
});
}
*/
}
})();
