/**
 * Created by juan on 19/10/15.
 */

'use strict';

(function () {
        var project = angular.module('projectmodule', []);

        project.controller('ProjectController', function ($scope, projectService, $stateParams, $state, $location) {

                var projectID = $stateParams.projectID;

                projectService.getProject(projectID).then(function (result) {
                        $scope.editingProject = result.data;
                }, function (response) {

                        switch (response.status) {
                                case 404:
                                        Materialize.toast('El proyecto no existe.', 4000, 'rounded');
                                        break;
                                default:
                                        Materialize.toast('Ha ocurrido un problema.', 4000, 'rounded');
                        }

                        $state.transitionTo('home');

                });

                $scope.deleteProject = function () {
                        projectService.deleteProject(projectID).then(function (result) {
                                //$scope.projects.splice(project["index"], 1);
                                $scope.editingProject = null;
                                Materialize.toast('El proyecto ha sido eliminado exitosamente.', 4000, 'rounded');
                                //$state.transitionTo('home');
                                $location.path('/home');
                        }, function () {
                                Materialize.toast('Ha ocurrido un error en la operación.', 4000, 'rounded');
                        });
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

                requestSvc.deleteProject = function (id) {
                        return $http({
                                method: "DELETE",
                                skipAuthorization: false,
                                url: getServerName + '/projects/' + id + '/'
                        })
                };

                return requestSvc;
        });
})();