/**
 * Created by juan on 21/01/16.
 */
/**
 * Created by juan on 15/01/16.
 */
'use strict';

(function () {
        var tool = angular.module('toolmodule', []);

        tool.controller('ToolController', function ($scope, $rootScope, toolService, Auth, $state, $stateParams, $location, _) {

                var tool_ID = parseInt($stateParams.toolID);

                $scope.tool_ID = tool_ID;
                $scope.editingTool = {};
                $scope.editingToolCopy = {};
                $scope.readOnlyF = true;
                $scope.toUploadFiles = [];
                $scope.toolFiles = [];
                $scope._ = _;
                $scope.exeDefined = false;

                $scope.checkExec = function () {
                        if ($scope.checkExistingExec()){
                                return false;
                        }else if(_.isEmpty(_.find($scope.toUploadFiles, {'exe': true}))){
                                return true;
                        }
                };

                $scope.checkExistingExec = function () {
                        return !_.isEmpty(_.find($scope.toolFiles, {'exe': true}));
                };

                $scope.removePreuploadFile = function (file) {
                        $scope.toUploadFiles.splice(_.findIndex($scope.toUploadFiles, {'id': file.id}), 1);
                };

                toolService.getTool(tool_ID).then(function (result) {
                        $scope.editingTool = result.data;
                }, function (response) {
                        switch (response.status) {
                                case 404:
                                        Materialize.toast('La herramienta no existe.', 4000, 'rounded');
                                        $location.path('/admin');
                                        break;
                                default:
                                        Materialize.toast('Ha ocurrido un problema.', 4000, 'rounded');
                        }
                });

                toolService.getFiles(tool_ID).then(function (result) {
                        $scope.toolFiles = result.data;
                });

                $scope.enableForm = function () {
                        $scope.editingToolCopy = angular.copy($scope.editingTool);
                        $scope.readOnlyF = !$scope.readOnlyF;
                };

                $scope.disableForm = function () {
                        $scope.readOnlyF = !$scope.readOnlyF;
                        $scope.editingToolCopy = {};
                };

                $scope.updateTool = function (tool) {
                        if (tool.params == null) tool.params = {};
                        toolService.editTool(tool).then(function (result) {
                                $scope.editingTool = result.data;
                                $scope.tools[_.findIndex($scope.tools, {'id': tool.id})] = result.data;
                                $scope.readOnlyF = !$scope.readOnlyF;
                                $scope.editingToolCopy = {};
                                $scope.EditingToolForm.$setPristine();
                                $scope.EditingToolForm.$setUntouched();
                                Materialize.toast("Edición de herramienta exitosa", 4000, 'rounded');
                        });


                };

                $scope.deleteTool = function () {
                        if (confirm('Está seguro?')) {
                                toolService.deleteTool(tool_ID).then(function () {
                                        $scope.tools.splice(_.findIndex($scope.tools, {'id': tool_ID}), 1);
                                        $scope.editingTool = {};
                                        $state.transitionTo('admin');
                                        Materialize.toast('La herramienta ha sido eliminado exitosamente.', 4000, 'rounded');
                                }, function () {
                                        Materialize.toast('Ha ocurrido un error en la operación.', 4000, 'rounded');
                                });
                        }
                };

                $scope.formatSize = function (bytes) {
                        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                        var precision = 1;
                        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                                number = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

                };

                $scope.prepareFiles = function (files) {
                        angular.forEach(files, function (file) {
                                file.filename = file.name;
                        });
                        $scope.toUploadFiles = files;
                        return $scope.checkExistingExec();
                };

                $scope.uploadFiles = function () {
                        angular.forEach($scope.toUploadFiles, function (file) {
                                toolService.uploadFile(tool_ID, file).then(function (response) {
                                        $scope.toolFiles.push(file);
                                        $scope.toUploadFiles.splice(_.findIndex($scope.toUploadFiles, {'id': file.id}), 1);
                                }, function (response) {
                                        Materialize.toast('Ha ocurrido un error en la carga del archivo "' + file.name + '".', 4000, 'rounded');
                                })
                        });
                };


                $scope.deleteFile = function (file) {
                        if (confirm('Está seguro?')) {
                                toolService.deleteFile(tool_ID, file).then(function () {
                                        $scope.toolFiles.splice(_.findIndex($scope.toolFiles, {'id': file.id}), 1);
                                }, function (response) {
                                        Materialize.toast('Ha ocurrido un error eliminando el archivo "' + file.filename + '".', 4000, 'rounded');
                                });
                        }
                };
        });

        tool.service('toolService', function ($http, getServerName, Upload) {

                var requestSvc = {};

                requestSvc.getTool = function (id) {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/tools/" + id + '/'
                        })
                };

                requestSvc.editTool = function (tool) {
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + "/tools/" + tool.id + '/',
                                data: tool
                        })
                };

                requestSvc.deleteTool = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + "/tools/" + id + '/'
                        })

                };

                requestSvc.getFiles = function (id) {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + "/tools/" + id + '/files/'
                        })
                };

                requestSvc.uploadFile = function (tool_ID, file) {
                        return Upload.upload({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + "/tools/" + tool_ID + "/files/",
                                data: {
                                        tool: tool_ID,
                                        file: file,
                                        filename: file.name,
                                        size: file.size,
                                        type: file.type,
                                        exe: file.exe
                                }
                        });
                };

                requestSvc.deleteFile = function (tool_ID, file) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/tools/' + tool_ID + '/files/' + file.id + '/'
                        })
                };


                return requestSvc;
        })

})();