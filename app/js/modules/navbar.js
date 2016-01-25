/**
 * Created by juan on 15/01/16.
 */
'use strict';

(function () {
        var nav = angular.module('navbarmodule', []);

        nav.controller('NavbarController', function ($scope, $rootScope, navbarService, Auth, $location) {

                navbarService.getUser().then(function (result) {
                        $scope.user = result.data;
                });

                $scope.copyUser = function () {
                        $scope.uUser = angular.copy($scope.user);
                };

                $scope.updateUser = function (user) {
                        homeService.updateUser(user).then(function (result) {
                                $rootScope.user = result.data;
                                $("#editUserModal").closeModal();
                                Materialize.toast('Edición de usuario exitosa.', 4000, 'rounded');
                        });
                };

                $scope.logout = function () {
                        Auth.logout(function () {
                                $location.path('/login');
                        });
                };

        });

        nav.directive('navbar', function(){

        });

        nav.service('navbarService', function ($http, getServerName) {

                var requestSvc = {};

                requestSvc.getUser = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/user/"
                        })
                };

                requestSvc.updateUser = function (user) {
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + '/user/',
                                data: user
                        })
                };

                return requestSvc;
        })

})();
