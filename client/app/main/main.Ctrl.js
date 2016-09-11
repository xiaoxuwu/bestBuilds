(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'scrapeAPI', '$http', '$alert', 'looksAPI', 'Upload'];

  function MainCtrl($scope, $state, Auth, $modal, scrapeAPI, $http, $alert, looksAPI, Upload) {
    $scope.user = Auth.getCurrentUser();

    $scope.look = {};
    $scope.looks = [];
    $scope.scrapePostForm = true;
    $scope.showScrapeDetails = false;
    $scope.gotScrapeResults = false;
    $scope.loading = false;

    $scope.picPreview = true;
    $scope.uploadLookTitle = true;
    $scope.uploadLookForm = false;

    $scope.busy = true;
    $scope.allData = [];
    var page = 0;
    var step = 3;

    var alertSuccess = $alert({
      title: 'Success! ',
      content: 'New Look added',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    })

    var alertFail = $alert({
      title: 'Not saved',
      content: 'New Look failed to save',
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

    $scope.reload = function() {
      $state.reload();
    };

    looksAPI.getAllLooks()
      .then(function(data) {
        console.log('looks found ');
        console.log(data);
        // $scope.looks = data.data;
        $scope.allData = data.data;
        $scope.nextPage();
        $scope.busy = false;
      })
      .catch(function(err) {
        console.log('failed to get looks ' + err);
      });

      $scope.nextPage = function() {
        var lookLength = $scope.looks.length;
        if($scope.busy) {
          return;
        }
        $scope.busy = true;
        $scope.looks = $scope.looks.concat($scope.allData.splice(page * step, step));
        page++;
        $scope.busy = false;
        if($scope.looks.length === 0) {
          $scope.noMoreData = true;
        }
      };

      $scope.showUploadForm = function() {
        $scope.uploadLookForm = true;
        $scope.scrapePostForm = false;
        $scope.uploadLookTitle = false;
      }

    // Watch for changes to URL, Scrape and Display the image
    $scope.$watch("look.link", function(newVal, oldVal) {
      if (newVal && newVal.length > 5) {
        $scope.loading = true;
        var link = {
            url: $scope.look.link
          }
        scrapeAPI.getScrapeDetails(link)
          .then(function(data) {
            console.log(data);
            $scope.showScrapeDetails = true;
            $scope.gotScrapeResults = true;
            $scope.uploadLookTitle = false;
            $scope.look.imgThumb = data.data.img;
            $scope.look.description = data.data.desc;
          })
          .catch(function(data) {
            console.log('failed to return from scrape');
            $scope.loading = false;
            $scope.look.link = '';
            $scope.gotScrapeResults = false;
          })
          .finally(function() {
            $scope.loading = false;
            $scope.uploadLookForm = false;
          });
      }
    });

    $scope.addVote = function(look) {

      looksAPI.upVoteLook(look)
        .then(function(data) {
          console.log(data);
          look.upVotes++;
        })
        .catch(function(err) {
          console.log('failed adding upvote ');
        });
    }

    $scope.addScrapePost = function() {
      var look = {
        description: $scope.look.description,
        title: $scope.look.title,
        image: $scope.look.imgThumb,
        linkURL: $scope.look.link,
        email: $scope.user.email,
        name: $scope.user.name,
        _creator: $scope.user._id
      }
      looksAPI.createScrapeLook(look)
        .then(function(data) {
          console.log('posted from frontend success');
          console.log(data);
          alertSuccess.show();
          $scope.showScrapeDetails = false;
          $scope.gotScrapeResults = false;
          $scope.look.title = '';
          $scope.look.link = '';
          $scope.looks.splice(0, 0, data.data);
        })
        .catch(function() {
          console.log('failed to post from frontend ');
          $scope.showScrapeDetails = false;
          alertFail.show(); // for our fail alert
        });
    }

    $scope.uploadPic = function(file) {
      Upload.upload({
        url: '/api/look/upload',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          file: file,
          title: $scope.look.title,
          description: $scope.look.description,
          email: $scope.user.email,
          name: $scope.user.name,
          linkURL: $scope.look._id,
          _creator: $scope.user._id
        }
      }).then(function(resp) {
        console.log('success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        $scope.looks.splice(0, 0, resp.data);
        $scope.look.title = '';
        $scope.look.description = '';
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

  }
})();
