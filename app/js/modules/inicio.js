'use strict';

(function () {
        var home = angular.module('homemodule', []);

        home.controller('HomeController', function ($scope, $rootScope, homeService, Auth, $location) {

                homeService.getUser().then(function (result) {
                        $scope.user = result.data;
                });

                $scope.copyUser = function () {
                        $scope.uUser = angular.copy($scope.user);
                };

                //$(".button-collapse").sideNav();

                $scope.updateUser = function (user) {
                        homeService.updateUser(user).then(function (result) {
                                $scope.user = result.data;
                                $scope.uUser = {};
                                $("#editUserModal").closeModal();
                                Materialize.toast('Edición de usuario exitosa.', 4000, 'rounded');
                        });
                };

                $scope.projects = [];

                homeService.getProjects().then(function (result) {
                        $scope.projects = result.data;
                });

                $scope.createProject = function (project) {
                        homeService.createProject(project).then(function (result) {
                                $scope.projects.push(result.data);
                                $scope.project = {};
                                $scope.ProjectForm.$setPristine();
                                $scope.ProjectForm.$setUntouched();
                                $("#newProjectModal").closeModal();
                                Materialize.toast("Creación de proyecto exitosa.", 4000, 'rounded');

                        });
                };

                $scope.logout = function () {
                        Auth.logout(function () {
                                $location.path('/login');
                        });
                };

        });

        home.service('homeService', function ($http, getServerName) {

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

                requestSvc.getProjects = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/projects/"
                        });
                };

                requestSvc.createProject = function (project) {
                        return $http({
                                method: "POST",
                                skipAuthorization: false,
                                url: getServerName + '/projects/',
                                data: project
                        })
                };

                return requestSvc;
        })

})();
