'use strict';

var app = angular.module('app', ['ngRoute']);

var configuracion = function ($routeProvider) {

   $routeProvider.when('/', {
      templateUrl: 'partials/login.html',
      controller: 'loginController'
   });
   
   $routeProvider.when('/home', {
      templateUrl: 'partials/home.html'
   });
   
   $routeProvider.otherwise({
      redirecTo: '/'
   });
};

app.config(configuracion);