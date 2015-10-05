'use strict';

(function () {
        var home = angular.module('homemodule', ['ngFileUpload']);

        home.controller('HomeController', function ($scope, requestService) {

                requestService.getUser().then(function (result) {
                        $scope.user = result.data;
                });

                $scope.updateUser = function (user) {
                        requestService.updateUser(user).then(function (result) {
                                $scope.user = result.data;
                        });
                };

                $scope.getProjects = function () {
                        requestService.getProjects().then(function (result) {
                                $scope.projects = result.data;
                        });
                };

                $scope.createProject = function (project) {
                        requestService.createProject(project).then(function (result) {
                                $scope.dataProjects.push(result);
                        });
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
                }

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
