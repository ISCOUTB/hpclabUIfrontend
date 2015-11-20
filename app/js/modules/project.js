/**
 * Created by juan on 19/10/15.
 */

'use strict';

(function () {

        var project = angular.module('projectmodule', ['homemodule']);

        project.controller('ProjectController', function ($scope, $rootScope, homeService, projectService, $stateParams, $state, $location) {

                function arrayObjectIndexOf(arr, obj) {
                        for (var i = 0; i < arr.length; i++) {
                                if (angular.equals(arr[i], obj)) {
                                        return i;
                                }
                        }
                        return -1;
                }

                function getIndex() {
                        var index = -1;
                        if ($scope.editingProjectIndex) {
                                index = $scope.editingProjectIndex;
                        } else {
                                index = arrayObjectIndexOf($rootScope.projects, $scope.editingProject);
                        }
                        return index;
                }

                var projectID = $stateParams.projectID;


                projectService.getProject(projectID).then(function (result) {
                        $scope.editingProject = result.data;
                }, function (response) {

                        switch (response.status) {
                                case 404:
                                        Materialize.toast('El proyecto no existe.', 4000, 'rounded');
                                        $location.path('/');
                                        break;
                                default:
                                        Materialize.toast('Ha ocurrido un problema.', 4000, 'rounded');
                        }

                });

                $scope.deleteProject = function () {
                        if (confirm('Está seguro?')){
                                projectService.deleteProject(projectID).then(function (result) {
                                        $scope.projects.splice(getIndex(), 1);
                                        $scope.editingProject = null;
                                        $scope.editingProjectIndex = null;
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