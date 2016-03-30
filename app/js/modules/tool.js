'use strict';

(function () {
    var tool = angular.module('toolmodule', []);

    tool.controller('ToolController', function ($scope, $rootScope, toolService, Auth, $state, $stateParams, $location, _) {

        var tool_ID = parseInt($stateParams.toolID);
        $('select').material_select();
        $('.tooltipped').tooltip({delay: 50});
        $scope._ = _;
        $scope.tool_ID = tool_ID;
        $scope.editingTool = {};
        $scope.editingToolCopy = {};
        $scope.infoCard = true;
        $scope.updateCard = false;
        $scope.paramEdition = false;
        $scope.paramAdd = false;
        $scope.paramFormVisible = false;
        $scope.paramForm = [];
        $scope.newParam = {};
        $scope.updateParamForm = [];
        $scope.paramUpdated = false;
        $scope.originalParam = {};
        $scope.editingParam = {};
        $scope.editingParamHash = null;
        $scope.paramTypes = [
            {
                value: [
                    {type: "text", name: "name", label: "Nombre", required: true},
                    {type: "text", name: "description", label: "Descripción", required: false},
                    {type: "number", name: "min", label: "Valor mínimo", required: true},
                    {type: "number", name: "max", label: "Valor máximo", required: true}
                ]
            },
            {
                string: [
                    {type: "text", name: "name", label: "Nombre", required: true},
                    {type: "text", name: "description", label: "Descripción", required: false}
                ]
            },
            {
                file: [
                    {type: "text", name: "name", label: "Nombre", required: true},
                    {type: "text", name: "description", label: "Descripción", required: false}
                ]
            }
        ];
        $scope.toUploadFiles = [];
        $scope.toolFiles = [];
        $scope.exeDefined = false;


        $scope.formatSize = function (bytes) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            var precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

        };

        toolService.getTool(tool_ID).then(function (result) {
            $scope.editingTool = result.data;
            $scope.editingToolCopy = angular.copy($scope.editingTool);
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

        $scope.enableUpdateToolForm = function () {
            $scope.editingToolCopy = angular.copy($scope.editingTool);
            $scope.infoCard = !$scope.infoCard;
            $scope.updateCard = !$scope.updateCard;
        };

        $scope.disableUpdateToolForm = function () {
            $scope.editingToolCopy = {};
            $scope.updateCard = !$scope.updateCard;
            $scope.infoCard = !$scope.infoCard;
        };

        $scope.updateTool = function (tool) {
            toolService.editTool(tool).then(function (result) {
                $scope.editingTool = result.data;
                $scope.tools.splice(_.findIndex($scope.tools, {'id': tool.id}), 1, result.data);
                $scope.editingToolCopy = {};
                $scope.updateCard = false;
                $scope.infoCard = true;
                $scope.paramUpdated = false;
                Materialize.toast("Edición de herramienta exitosa", 4000, 'rounded');
            });
        };

        $scope.enableParamAdd = function () {
            $scope.paramAdd = !$scope.paramAdd;
        };

        $scope.addParamForm = function () {
            $scope.paramForm = [];
            switch ($scope.newParam.type) {
                case 'value':
                    $scope.paramForm.push((_.find($scope.paramTypes, 'value')).value);
                    break;
                case 'string':
                    $scope.paramForm.push((_.find($scope.paramTypes, 'string')).string);
                    break;
                case 'file':
                    $scope.paramForm.push((_.find($scope.paramTypes, 'file')).file);
                    break;
                default:
                    break;
            }
            $scope.paramFormVisible = true;
        };

        $scope.cancelParamAdd = function () {
            $scope.paramForm = [];
            $scope.newParam = {};
            $scope.paramFormVisible = false;
            $scope.paramAdd = !$scope.paramAdd;
        };

        $scope.addParam = function (param) {
            $scope.editingToolCopy.params.push(param);
            $scope.paramForm = [];
            $scope.newParam = {};
            $scope.paramFormVisible = false;
            $scope.paramAdd = !$scope.paramAdd;
            $scope.paramUpdated = true;
        };

        $scope.showUpdateParamForm = function (param){
            $scope.updateParamForm = [];
            $scope.editingParamHash = param.$$hashKey;
            $scope.originalParam = param;
            $scope.editingParam = angular.copy(param);
            $scope.paramEdition = true;
            switch (param.type) {
                case 'value':
                    $scope.updateParamForm.push((_.find($scope.paramTypes, 'value')).value);
                    break;
                case 'string':
                    $scope.updateParamForm.push((_.find($scope.paramTypes, 'string')).string);
                    break;
                default:
                    break;
            }
        };

        $scope.cancelParamUpdate = function () {
            $scope.updateParamForm = [];
            $scope.editingParamHash = null;
            $scope.originalParam = {};
            $scope.editingParam = {};
            $scope.paramEdition = false;
        };

        $scope.updateParam = function (param){
            $scope.editingToolCopy.params.splice(_.findIndex($scope.editingToolCopy.params, $scope.originalParam), 1, param);
            this.cancelParamUpdate();
            $scope.paramUpdated = true;
        };

        $scope.deleteParam = function (param) {
            if (confirm('Está seguro?')) {
                $scope.editingToolCopy.params.splice(_.findIndex($scope.editingToolCopy.params, param), 1);
                this.cancelParamUpdate();
            }
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

        $scope.prepareFiles = function (files) {
            angular.forEach(files, function (file) {
                file.filename = file.name;
            });
            $scope.toUploadFiles = files;
            return $scope.checkExistingExec();
        };

        $scope.checkExec = function () {
            if ($scope.checkExistingExec()) {
                return false;
            } else if (_.isEmpty(_.find($scope.toUploadFiles, {'exe': true}))) {
                return true;
            }
        };

        $scope.checkExistingExec = function () {
            return !_.isEmpty(_.find($scope.toolFiles, {'exe': true}));
        };

        $scope.removePreuploadFile = function (file) {
            $scope.toUploadFiles.splice(_.findIndex($scope.toUploadFiles, {'id': file.id}), 1);
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