'use strict';

(function () {
        var home = angular.module('homemodule', ['ngFileUpload']);

        home.controller('HomeController', function ($scope, requestService, Upload, getServerName) {
                $scope.sendRequest = function () {
                        requestService.getProjects().then(function (result) {
                                console.log(result.data);
                        });
                };

                $scope.$watch('files', function () {
                        $scope.upload($scope.files)
                });

                $scope.upload = function (files) {
                        if (files && files.length) {
                                for (var i = 0; i < files.length; i++) {
                                        var file = files[i];
                                        requestService.uploadFiles(file).progress(function (evt) {
                                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                                $scope.log = 'progress: ' + progressPercentage + '% ';
                                        }).success(function () {
                                                console.log("Succesfully");
                                        });
                                }
                        }
                }
        });

        home.service('requestService', function ($http, getServerName, Upload) {
                var requestSvc = {};
                requestSvc.getProjects = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/projects/"
                        });
                };

                requestSvc.uploadFiles = function (files) {
                        console.log(files);
                        return Upload.upload({
                                method: "POST",
                                skipAuthorization: false,
                                url: getServerName + "/files/",
                                data: {file: files}
                        });
                };

                return requestSvc;
        })

})();
