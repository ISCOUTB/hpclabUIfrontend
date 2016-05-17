'use strict';


(function () {
    var app = angular.module('app', [
        'ui.router',
        'angular-jwt',
        'oc.lazyLoad',
        'ngMessages',
        'factories',
        'loginmodule',
        'homemodule',
        'projectmodule',
        'adminmodule',
        'navbarmodule',
        'toolmodule',
        'ui.materialize',
        'lodash',
        'ngAnimate',
        'ngResource',
        'textAngular',
        'ngSanitize',
        'uuid4'
    ]);

    var config = function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider) {

        $httpProvider.interceptors.push(function ($location, $q, jwtHelper) {
            return {
                request: function (conf) {
                    var token = localStorage.getItem('token');
                    if (token && !jwtHelper.isTokenExpired(token)) {
                        conf.headers.Authorization = 'Bearer ' + token;
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
                cache: false,
                url: '/login',
                templateUrl: '/views/login.html',
                controller: 'loginController',
                resolve: {
                    verifyToken: function ($location, jwtHelper) {
                        var token = localStorage.getItem('token');
                        if (token && !jwtHelper.isTokenExpired(token)) {
                            $location.path("/");
                        }
                    }
                }
            })
            .state('home', {
                url: '/',
                templateUrl: '/views/home.html',
                controller: 'HomeController'
            })
            .state('home.project', {
                url: 'project/:projectID',
                templateUrl: '/views/projectDetail.html',
                controller: 'ProjectController',
                onEnter: function ($state, $stateParams) {
                    if (!$stateParams.projectID) {
                        $state.transitionTo('/')
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: '/views/admin.html',
                controller: 'AdminController'
            })
            .state('admin.tool', {
                url: '/tool/:toolID',
                templateUrl: '/views/toolDetail.html',
                controller: 'ToolController',
                onEnter: function ($state, $stateParams) {
                    if (!$stateParams.toolID) {
                        $state.transitionTo('/admin')
                    }
                }

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

$(document).ready(function(){
    //console.log("Ejecución, pero no hace nada");
    $('ul.tabs').tabs();
});