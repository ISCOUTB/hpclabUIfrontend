'use strict';

(function () {
        var home = angular.module('iniciomodule', ['ngFileUpload']);

        home.controller('InicioController', function ($scope, requestService, Auth, $location) {

                requestService.getUser().then(function (result) {
                        $scope.user = result.data;
                });

                $scope.copyUser = function () {
                        $scope.uUser = angular.copy($scope.user);
                };

                $scope.updateUser = function (user) {
                        requestService.updateUser(user).then(function (result) {
                                $scope.user = result.data;
                        });
                };

                requestService.getProjects().then(function (result) {
                        $scope.projects = result.data;
                });

                $scope.createProject = function (project) {
                        requestService.createProject(project).then(function (result) {
                                $scope.projects.push(result.data);
                                $scope.project = [];
                                $scope.ProjectForm.$setPristine();
                                $scope.ProjectForm.$setUntouched();
                        });
                };

                $scope.deleteProject = function ($event, id) {
                        var parentID = $event.target.parentElement;
                        requestService.deleteProject(id).then(function (result) {
                                parentID.remove();
                                console.log("ha sido eliminado");

                        })
                };

                requestService.getFiles().then(function (result) {
                        $scope.datafiles = result.data;
                });

                $scope.$watch('files', function () {
                        $scope.upload($scope.files)
                });

                $scope.upload = function (files) {
                        if (files && files.length) {
                                for (var i = 0; i < files.length; i++) {
                                        var file = files[i];
                                        requestService.createFile(file).progress(function (evt) {
                                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                                console.log('progress: ' + progressPercentage + '% ');
                                        }).success(function (response) {
                                                $scope.datafiles.push(response);
                                        });
                                }
                        }
                };

                $scope.logout = function () {
                        Auth.logout(function () {
                                $location.path('/login');
                        });
                };

        });

        home.service('requestService', function ($http, getServerName, Upload) {

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

                requestSvc.deleteProject = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/projects/' + id + '/'
                        })
                };

                requestSvc.getFiles = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/files/"
                        })
                };

                requestSvc.createFile = function (file) {
                        return Upload.upload({
                                method: "POST",
                                skipAuthorization: false,
                                url: getServerName + "/files/",
                                data: {
                                        file: file,
                                        filename: file.name,
                                        size: file.size,
                                        type: file.type
                                }
                        });
                };

                return requestSvc;
        })

})();
