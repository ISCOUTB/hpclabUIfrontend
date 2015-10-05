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
                'homemodule',
                'ngMdIcons'
        ]);

        var config = function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider) {

                $httpProvider.interceptors.push(function ($location, $q, $rootScope, jwtHelper) {
                        return {
                                request: function (conf) {
                                        $rootScope.processing = true;
                                        var token = localStorage.getItem('token');
                                        if (token && !jwtHelper.isTokenExpired(token)) {
                                                console.log("Is valid and is not expired");
                                                conf.headers.Authorization = 'Bearer ' + token;
                                                $location.path("/home");
                                        } else {
                                                localStorage.removeItem('token');
                                                $location.path("/login");
                                        }
                                        return conf;
                                }
                        }
                });

                $stateProvider
                        .state('login', {
                                url: '/login',
                                templateUrl: 'partials/login.html',
                                controller: 'loginController'
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

        app.config(config);


})();
