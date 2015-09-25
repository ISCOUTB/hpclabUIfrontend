'use strict';

var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages']);

var config = function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'
    });

    $routeProvider.when('/home', {
        templateUrl: 'partials/home.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
};

app.config(config);

