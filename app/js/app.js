'use strict';

(function () {
   var app = angular.module('app', [
      'ui.router',
      'angular-jwt',
	  'oc.lazyLoad',
	  'ngMaterial',
	  'ngMessages',
      'factories',
      'loginmodule',
      'homemodule'
	]);

   var configuracion = function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider, jwtInterceptorProvider) {

      jwtInterceptorProvider.tokenGetter = function () {
         var token = window.localStorage.getItem("token");
         return token;
      }

      $httpProvider.interceptors.push('jwtInterceptor');




      $stateProvider
         .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController',
         })
         .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
         });

      $urlRouterProvider.otherwise("/login");

      if (window.history && window.history.pushState) {
         $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
         });
      }
   };

   app.config(configuracion);


})();
