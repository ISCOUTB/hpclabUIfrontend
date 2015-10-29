/**
 * Created by juan on 23/10/15.
 */
'use strict';

(function () {

        var file = angular.module('filemodule', ['homemodule', 'ngFileUpload']);

        file.controller('FileController', function ($scope, fileService, $stateParams, $state, $location, $timeout) {

                $scope.$watch('files', function () {
                        $scope.uploadFiles($scope.files)
                });

                $scope.moreInfo = null;

                $scope.showInfo = function (id) {
                        $scope.selectedIndex = id;
                        $scope.moreInfo = $scope.datafiles[id];
                        console.log($scope.datafiles[id]);
                };

                $scope.formatSize = function (bytes) {
                        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                        var precision = 1;
                        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                                number = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

                };

                $scope.uploadFiles = function (files) {
                        angular.forEach(files, function (file) {
                                fileService.createFile(file).then(function (response) {
                                        $timeout(function () {
                                                $scope.datafiles.push(response.data);
                                        });
                                });
                        });
                };

                fileService.getFiles().then(function (result) {
                        $scope.datafiles = result.data;
                });

                $scope.deleteFile = function (id) {
                        if (confirm('Está seguro?')) {
                                fileService.deleteFile(id).then(function (response) {
                                        $scope.datafiles.splice($scope.selectedIndex, 1);
                                        $scope.selectedIndex = null;
                                        $scope.moreInfo = null;
                                        Materialize.toast('El archivo ha sido eliminado exitosamente.', 4000, 'rounded');
                                }, function (response) {
                                        Materialize.toast('Ha ocurrido un error eliminando el archivo.', 4000, 'rounded');
                                })
                        }
                };


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