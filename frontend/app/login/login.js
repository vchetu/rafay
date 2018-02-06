'use strict';

angular.module('rafay.login', ['ngRoute', 'ngCookies'])

.controller('LoginCtrl', ['$state', '$rootScope', '$cookies', '$http', function($state, $rootScope, $cookies,  $http) {

  var vm = this;
  
  vm.wrongDetails = false;
  $rootScope.loggedIn = false;

  vm.login = function() {
    vm.dataLoading = true;
    vm.getToken();
  };


  vm.getToken = function() {
    var data = "grant_type=password&client_id=" + $rootScope.client_id + "&client_secret=" + $rootScope.client_secret + "&username=" + vm.username + "&password=" + vm.password;
    $http.post("http://" + $rootScope.apiserver_ip +":" + $rootScope.apiserver_port + "/o/token/", data, {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      }
    }).then(function(resp) {
      vm.dataLoading = false;
      console.log(resp);
      $rootScope.loggedIn = true;
      $state.go('home');
      $cookies.put("access_token", resp.data.access_token);
      $cookies.put("refresh_token", resp.data.refresh_token);
      vm.expires = resp.expires_in;
      $rootScope.loggedInUser = vm.username;
      $rootScope.loggedInPwd = vm.password;
    },function(resp) {
      vm.dataLoading = false;
      vm.wrongDetails = true;
    })
  }

  vm.close = function() {
    vm.wrongDetails = false;
  };

  vm.logout = function() {
    $cookies.remove("access_token");
    $cookies.remove("refresh_token");
  }

}]);