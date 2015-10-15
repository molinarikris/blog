var blog = angular.module('Blog', ['ngMaterial', 'ngRoute'])
  .config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    }).when('/newPost', {
      templateUrl: 'views/compose.html',
      controller: 'compCtrl'
    }).when('/post/:id', {
      templateUrl: 'views/singlePost.html',
      controller: 'postCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }]);

blog.controller('blogCtrl',
  ['$scope', '$http', '$route', '$location', '$routeParams',
  '$mdSidenav', '$mdUtil', '$mdToast',
  function($scope, $http, $route, $location, $routeParams,
    $mdSidenav, $mdUtil, $mdToast) {

  $http.get('/blog/service/posts').then(function(res) {
    $scope.titles = res.data;
  }, function(err) {
    console.log(err);
  });
  $scope.goTo = function(url) {
    $location.url(url);
  };
  $scope.deletePost = function(postTime) {
    var toast = $mdToast.simple()
      .content('Delete this post?')
      .action('Yes')
      .highlightAction(false)
      .position('bottom right')
      .hideDelay(9000);
    $mdToast.show(toast).then(function(res) {
      console.log(res);
      res === "ok" ? (
        $http.get('/blog/service/deletePost/' + postTime)
          .then(function(res) {
            $scope.titles = $scope.titles.filter(function(it) {
              if (it.created_at === postTime) {
                return false
              } else return true
            });
          }, function(err) {
            console.log(err);
          })
      ) : $mdToast.hide();
    })
  }
}]).controller('homeCtrl', ["$scope", "$http", function(s, h) {
  h.get('/blog/service/featured').then(function(res) {
    s.featuring = res.data;
  }, function(err) {
    console.log(err);
  });
}]).controller('compCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', function($scope, $http, $location, $route, $routeParams) {
  $scope.post = {};
  $scope.fileItAway = function(post) {
    post.created_at = new Date();
    $http.post('/blog/service/newPost', post).then(function(res) {
      console.log("Success");
      $scope.res = "Saved!";
      setTimeout(function() {
        $location.url('/');
      }, 2000);
    }, function(err) {
      $scope.res = "Oh no!";
    })
  };
  $scope.feated = function() {
    if ($scope.post.featured) {
      $scope.featedClass = 'md-accent';
      return "Yes! This will appear on the front page.";
    } else {
      $scope.featedClass = 'md-warn'
      return "No. Users will have to look for this article.";
    }
  }
}]).controller('postCtrl', function() {

});
