/**
 * Created by juan on 23/10/15.
 */
'use strict';

(function () {

        var file = angular.module('filemodule', ['homemodule', 'ngFileUpload']);

        file.controller('FileController', function ($scope, fileService, $stateParams, $state, $location, $timeout, $rootScope, jwtHelper) {

                $scope.showInfo = function (id) {
                        $scope.selectedIndex = id;
                        $scope.moreInfo = $scope.datafiles[id];
                };

                $scope.selectedFiles = [];

                $scope.selectedFilesSize = 0;

                $scope.uploading = false;

                $scope.select = function (file) {
                        file.selected = !file.selected;
                        if (file.selected) {
                                $scope.selectedFiles.push(file);
                                $scope.selectedFilesSize += file.size;
                        } else {
                                $scope.selectedFiles.splice(arrayObjectIndexOf($scope.selectedFiles, file), 1);
                                $scope.selectedFilesSize -= file.size;
                        }
                };

                function arrayObjectIndexOf(arr, obj) {
                        for (var i = 0; i < arr.length; i++) {
                                if (angular.equals(arr[i], obj)) {
                                        return i;
                                }
                        }
                        return -1;
                }

                $scope.formatSize = function (bytes) {
                        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                        var precision = 1;
                        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                                number = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

                };

                $scope.uploadFiles = function (files) {
                        $scope.uploadingFiles = files;
                        angular.forEach(files, function (file) {
                                $scope.uploading = true;
                                fileService.createFile(file).then(function (response) {
                                        $timeout(function () {
                                                $rootScope.datafiles.push(response.data);
                                        });
                                }, function (response) {
                                        Materialize.toast('Ha ocurrido un error en la carga del archivo "' + file.name + '".', 4000, 'rounded');
                                }, function (evt) {
                                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                });
                        });
                };

                $scope.cleanUpload = function(){
                        $scope.uploading = false;
                };

                $scope.deleteFiles = function (files) {
                        if (confirm('Está seguro?')) {
                                angular.forEach(files, function (file) {
                                        fileService.deleteFile(file.id).then(function (response) {
                                                $rootScope.datafiles.splice(arrayObjectIndexOf($rootScope.datafiles, file), 1);
                                                $scope.selectedFiles.splice(arrayObjectIndexOf($scope.selectedFiles, file), 1);
                                                $scope.selectedFilesSize -= file.size;
                                        }, function (response) {
                                                Materialize.toast('Ha ocurrido un error eliminando el archivo "' + file.filename + '".', 4000, 'rounded');
                                        })

                                })
                        }
                };

                fileService.getFiles().then(function (result) {
                        $rootScope.datafiles = result.data;
                });

        });

        file.service('fileService', function ($http, getServerName, Upload) {

                var requestSvc = {};

                requestSvc.createFile = function (file) {
                        return Upload.upload({
                                method: "PUT",
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

                requestSvc.getFiles = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/files/"
                        })
                };

                requestSvc.deleteFile = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/files/' + id + '/'
                        })
                };

                return requestSvc;

        });

})();