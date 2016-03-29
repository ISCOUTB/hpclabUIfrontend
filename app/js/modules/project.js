/**
 * Created by juan on 19/10/15.
 */

'use strict';

(function () {

        var project = angular.module('projectmodule', ['homemodule']);

        project.controller('ProjectController', function ($scope, $rootScope, homeService, projectService, $stateParams, $state, $location, _) {

                var projectID = parseInt($stateParams.projectID);

                projectService.getProject(projectID).then(function (result) {
                        $scope.editingProject = result.data;
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

                projectService.getTools().then(function (result) {
                        console.log(result);
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

        });

        project.service('projectService', function ($http, getServerName) {

                var requestSvc = {};

                requestSvc.getProject = function (id) {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/projects/' + id + '/'
                        })
                };

                requestSvc.updateProject = function (id, project) {
                        return $http({
                                method: "PUT",
                                skipAuthorization: false,
                                url: getServerName + '/projects/' + id + '/',
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

                requestSvc.getTools = function () {
                        return $http({
                                method: "GET",
                                skipAuthorization: false,
                                url: getServerName + '/ptools/'
                        })
                };

                return requestSvc;

        });

})();