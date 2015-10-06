'use strict';

(function () {
        var login = angular.module('loginmodule', ['angular-jwt']);

        login.controller('loginController', function ($scope, jwt_loginService, $location) {

                $scope.login = function (user) {
                        jwt_loginService.login(user).then(function (result) {
                                var token = result.data.token;
                                localStorage.setItem('token', token);
                                $location.path('/home');
                        });
                }
        });

        login.factory('jwt_loginService', function ($http, getServerName) {
                var loginSvc = {};
                loginSvc.login = function (user) {

                        return $http({
                                method: "POST",
                                skipAuthorization: true,
                                url: getServerName + "/api-token-auth/",
                                data: user
                        });
                };
                return loginSvc;
        });


})();
