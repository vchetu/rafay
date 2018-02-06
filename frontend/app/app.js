'use strict';

angular.module('rafay', [
  'ngRoute',
  'ngCookies',
  'angular-growl',
  'rafay.home',
  'rafay.login',
  'ui.router',
  'ui.router.state.events'
]).


run(['$rootScope', '$state', '$cookies', function($rootScope, $state, $cookies) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = !toState.name.includes('login');
      // var restrictedPage2 = !toState.name.includes('home')
      $rootScope.token = $cookies.get('access_token');
      
      var loggedIn = $rootScope.loggedIn;
       if (restrictedPage && !$rootScope.token) {
           event.preventDefault()
           $state.go('login');
       }
   });
}])

.config(['$locationProvider', '$routeProvider', '$urlRouterProvider', '$stateProvider', function($locationProvider, $routeProvider, $urlRouterProvider, $stateProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        "main": {
          controller: 'HomeCtrl',
          templateUrl: 'home/home.html'
        },
      }
    })
    .state('login', {
      views: {
        "main": {
          templateUrl: 'login/login.html',
          controller: 'LoginCtrl'
        },
      }
    })
}])

var rafay = angular.module('rafay')
rafay.controller('notifyCtrl',['$scope', '$rootScope', '$location', '$http',function($scope,$rootScope,$location,$http){
       $http.get('connection.json').then(function (response) {
          console.log(response);
          console.log($location.$$host);
          // $rootScope.apiserver_ip = response.data.apiserver_ip;
          $rootScope.apiserver_ip = $location.$$host;
          $rootScope.apiserver_port = response.data.apiserver_port;
          $rootScope.client_id = response.data.client_id;
          $rootScope.client_secret = response.data.client_secret;
        });
}]);
