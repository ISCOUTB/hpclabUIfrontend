'use strict';

var app = angular.module('app', ['ngRoute']);

var configuracion = function ($routeProvider) {
   
   $routeProvider.when('/', {
      templateUrl: 'partials/login.html',
      controller:'loginController'
   }).otherwise({
      redirecTo: '/'
   });
};

app.config(configuracion);