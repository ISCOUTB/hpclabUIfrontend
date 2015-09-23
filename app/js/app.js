'use strict';

var app = angular.module('app', ['ngRoute']);

var configuracion = function ($routeProvider) {
   
   $routeProvider.when('/login', {
      templateUrl: 'partials/login.html',
      controller:'loginController'
   }).otherwise({
      redirecTo: '/login'
   });
};

app.config(configuracion);