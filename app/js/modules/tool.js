/**
 * Created by juan on 21/01/16.
 */
/**
 * Created by juan on 15/01/16.
 */
'use strict';

(function () {
        var tool = angular.module('toolmodule', []);

        tool.controller('ToolController', function ($scope, $rootScope, toolService, Auth, $stateParams, $location, _) {

                var tool_ID = parseInt($stateParams.toolID);

                $scope.tool_ID = tool_ID;
                $scope.editingTool = {};
                $scope.readOnlyF = true;
                $scope.toUploadFiles = [];

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

                $scope.switchForm = function () {
                        $scope.readOnlyF = !$scope.readOnlyF;
                };

                $scope.updateTool = function (tool){
                        tool.params = {};
                        toolService.editTool(tool).then(function (result) {
                                $scope.editingTool = result.data;
                                $scope.tools[_.findIndex($scope.tools, {'id': tool.id})] = result.data;
                                $scope.EditingToolForm.$setPristine();
                                $scope.EditingToolForm.$setUntouched();
                                Materialize.toast("Edición de herramienta exitosa", 4000, 'rounded');

                        });

                };

                $scope.deleteTool = function () {
                        if (confirm('Está seguro?')){
                                toolService.deleteTool(tool_ID).then(function(){
                                        $scope.tools.splice(_.findIndex($scope.tools, {'id': tool_ID}), 1);
                                        $scope.editingTool = {};
                                        $state.transitionTo('admin');
                                        Materialize.toast('La herramienta ha sido eliminado exitosamente.', 4000, 'rounded');
                                }, function (){
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
                        $scope.toUploadFiles = files;
                };

                $scope.inspectFiles = function () {
                        console.log($scope.toUploadFiles);
                };


        });

        tool.service('toolService', function ($http, getServerName) {

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

                return requestSvc;
        })

})();