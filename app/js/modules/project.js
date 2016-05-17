/**
 * Created by juan on 19/10/15.
 */

'use strict';

(function () {

        var project = angular.module('projectmodule', ['ngFileUpload', 'uuid4']);

        project.controller('ProjectController', function ($scope, $rootScope, homeService, projectService, $stateParams, $timeout, $state, $location, _, uuid4) {

                var projectID = parseInt($stateParams.projectID);
                $('.collapsible').collapsible();
                $('.tooltipped').tooltip();
                $scope.datafiles = [];
                $scope.selectedFiles = [];
                $scope.confTaskForm = null;
                $scope.uploading = false;
                $scope.selectedProjectIndex = null;
                $scope.toolInfo = null;
                $scope.taskConfig = false;
                $scope.currentTaskID = null;
                $scope.formatSize = function (bytes) {
                        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                        var precision = 1;
                        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                                number = Math.floor(Math.log(bytes) / Math.log(1024));
                        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];

                };
                $scope.tools = [];
                $scope.tasks = [];

                $scope.params = {};

                projectService.getTools().then(function (result) {
                        $scope.tools = result.data;
                });

                projectService.getTasks(projectID).then(function (result) {
                        $scope.tasks = result.data;
                });

                $scope.moreInfo = function(tool){
                        $scope.toolInfo = tool;
                        $('#moreInfoModal').openModal();
                };

                //Project info (get, update, delete)

                projectService.getProject(projectID).then(function (result) {
                        $scope.editingProject = result.data;
                        $scope.selectedProjectIndex = _.findIndex($scope.projects, {'id': projectID});
                }, function (response) {

                        switch (response.status) {
                                case 403:
                                        Materialize.toast('No tiene autorización para acceder a este proyecto.', 4000, 'rounded');
                                        $location.path('/');
                                        break;
                                case 404:
                                        Materialize.toast('El proyecto no existe.', 4000, 'rounded');
                                        $location.path('/');
                                        break;
                                default:
                                        Materialize.toast('Ha ocurrido un problema.', 4000, 'rounded');
                        }

                });

                $scope.copyProject = function () {
                        $scope.uProject = angular.copy($scope.editingProject);
                };

                $scope.updateProject = function (project) {
                        projectService.updateProject(projectID, project).then(function(result){
                                $scope.editingProject = result.data;
                                $scope.projects[_.findIndex($scope.projects, {'id': projectID})] = result.data;
                                $scope.uProject = {};
                                $scope.UpdateProjectForm.$setPristine();
                                $scope.UpdateProjectForm.$setUntouched();
                                $("#editProjectModal").closeModal();
                                Materialize.toast("Edición de proyecto exitosa.", 4000, 'rounded');
                        });
                };

                $scope.deleteProject = function () {
                        if (confirm('Está seguro?')) {
                                projectService.deleteProject(projectID).then(function () {
                                        $scope.projects.splice(_.findIndex($scope.projects, {'id': projectID}), 1);
                                        $scope.editingProject = {};
                                        $state.transitionTo('home');
                                        Materialize.toast('El proyecto ha sido eliminado exitosamente.', 4000, 'rounded');
                                }, function () {
                                        Materialize.toast('Ha ocurrido un error en la operación.', 4000, 'rounded');
                                });
                        }
                };


                //Project input files (get, upload, delete)

                projectService.getFiles(projectID).then(function (result) {
                        console.log(result)
                        $scope.datafiles = result.data;
                }), function(response){
                    console.log(response);
                };

                $scope.uploadFiles = function (files) {
                        $scope.uploadingFiles = files;
                        angular.forEach(files, function (file) {
                                $scope.uploading = true;
                                projectService.addFile(file, projectID).then(function (response) {
                                        $timeout(function () {
                                                $scope.datafiles.push(response.data);
                                        });
                                }, function (response) {
                                    console.log(response)
                                        Materialize.toast('Ha ocurrido un error en la carga del archivo "' + file.name + '".', 4000, 'rounded');
                                }, function (evt) {
                                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                });
                        });
                };

                $scope.cleanUpload = function(){
                        $scope.uploading = false;
                };

                $scope.select = function (file) {
                        file.selected = !file.selected;
                        if (file.selected) {
                                $scope.selectedFiles.push(file);
                        } else {
                                $scope.selectedFiles.splice(_.findIndex($scope.selectedFiles, {'id': file.id}), 1);
                        }
                };

                $scope.deleteFiles = function (files) {
                        if (confirm('Está seguro?')) {
                                angular.forEach(files, function (file) {
                                        projectService.deleteFile(file.id).then(function () {
                                                $scope.datafiles.splice(_.findIndex($scope.datafiles, {'id': file.id}), 1);
                                                $scope.selectedFiles.splice(_.findIndex($scope.selectedFiles, {'id': file.id}), 1);
                                                $scope.selectedFilesSize -= file.size;
                                        }, function (response) {
                                                Materialize.toast('Ha ocurrido un error eliminando el archivo "' + file.filename + '".', 4000, 'rounded');
                                        })

                                })
                        }
                };

                //Project tasks (Add tasks, configure, delete)

                $scope.addTask = function (task) {
                        task.project = projectID;
                        task.uuid = uuid4.generate();
                        task.tool = task.id;
                        delete task.id;
                        projectService.addTask(task).then(function(result){
                                $scope.tasks.push(result.data);
                        }, function (response){
                                Materialize.toast("Ha ocurrido un error agregando el trabajo.");
                        });

                };
                
                $scope.configureTaskForm = function (task) {
                        task.params = JSON.parse(task.params);
                        $scope.confTaskForm = [];
                        $scope.confTaskForm = task.params;
                        $scope.currentTask = task;
                        $scope.taskConfig = true;
                };

                $scope.updateTask = function () {
                        //Falta implementar

                };

                $scope.consoleA = function () {
                        //$.each($scope.params, function(key, value){
                        //        var a = _.pick($scope.currentTask, key);
                        //        a.value = value;
                        //        console.log(a);
                        //});
                        console.log($scope.currentTask);
                };

                $scope.deleteTask = function () {
                        projectService.deleteTask($scope.currentTask).then(function(){
                                $scope.tasks.splice(_.findIndex($scope.tasks, {'uuid': $scope.currentTask.uuid}), 1);
                                $scope.currentTask = null;
                                $scope.taskConfig = false;
                                $scope.confTaskForm = null;
                        }, function (response){
                                Materialize.toast("Ha ocurrido un error mientras se eliminaba el trabajo.");
                        });
                }
        });

        project.service('projectService', function ($http, getServerName, Upload, $stateParams) {

                var requestSvc = {};

                requestSvc.getProject = function (id) {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + id + '/'
                        })
                };

                requestSvc.updateProject = function (id, project) {
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + id + '/',
                                data: project
                        })
                };

                requestSvc.deleteProject = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + id + '/'
                        })
                };

                requestSvc.getTools = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/ptools/'
                        })
                };

                requestSvc.getFiles = function (projectID) {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + projectID + '/files/'
                        })
                };

                requestSvc.addFile = function (file, projectID) {
                        return Upload.upload({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + "/project/" + projectID + "/files/",
                                data: {
                                        project: projectID,
                                        file: file,
                                        filename: file.name,
                                        size: file.size,
                                        type: file.type
                                }
                        });
                };

                requestSvc.deleteFile = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/file/' + id + '/'
                        })
                };

                requestSvc.getTasks = function (id){
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + id + '/tasks/'
                        })
                };

                requestSvc.addTask = function (task){
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + task.project + '/tasks/',
                                data: task
                        })
                };


                requestSvc.updateTask = function (task){
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + task.project + '/task/' + task.uuid + '/',
                                data: task
                        })
                };


                requestSvc.deleteTask = function (task){
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/project/' + task.project + '/task/' + task.uuid + '/'
                        })
                };


                return requestSvc;

        });

})();