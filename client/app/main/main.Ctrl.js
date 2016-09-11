(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$state', 'Auth', '$modal', 'looksAPI', 'scrapeAPI', '$alert', '$Upload'];

  function MainCtrl($scope, $state, Auth, $modal, looksAPI, scrapeAPI, $alert, $Upload) {
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
    var alertSuccess = $alert({
      title: 'Success! ',
      content: 'New Build added',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'success',
      duration: 8
    });

    var alertFail = $alert({
      title: 'Not saved ',
      content: 'New Build failed to save',
      placement: 'top-right',
      container: '#alertContainer',
      type: 'warning',
      duration: 8
    });

    $scope.reloadRoute = function() {
      $state.reload();
    };

    var myModal = $modal({
      scope: $scope,
      show: false
    });

    $scope.showModal = function() {
      myModal.$promise.then(myModal.show);
    }

    looksAPI.getAllLooks()
      .then(function(data) {
        $scope.looks = data.data;
      })
      .catch(function(err) {
        console.log('failed to get looks' + err);
      })

    // Watch for changes to URL, Scrape and Display Results
    $scope.$watch('look.link', function(newVal, oldVal) {
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
          alertSuccess.show();
          $scope.showScrapeDetails = false;
          $scope.gotScrapeResults = false;
          $scope.look.title = '';
          $scope.look.link = '';
          $scope.looks.splice(0, 0, data.data);
          console.log(data);
        })
        .catch(function() {
          console.log('failed to post');
          alertFail.show();
          $scope.showScrapeDetails = false;
        });
    }

  }
})();
