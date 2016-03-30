'use strict';

(function () {
    var home = angular.module('homemodule', []);

    home.controller('HomeController', function ($scope, $rootScope, homeService, Auth, $location, $state, _) {

        $scope.projects = [];

        homeService.getProjects().then(function (result) {
            $scope.projects = result.data;
            if ($scope.projects.length > 0) {
                $state.go('home.project', {projectID: (_.head($scope.projects)).id});
            }
        });

        $scope.createProject = function (project) {
            homeService.createProject(project).then(function (result) {
                $scope.projects.push(result.data);
                $scope.project = {};
                $scope.ProjectForm.$setPristine();
                $scope.ProjectForm.$setUntouched();
                $("#newProjectModal").closeModal();
                Materialize.toast("Creación de proyecto exitosa.", 4000, 'rounded');
                $state.go('home.project', {projectID: result.data.id});
            });
        };
        
    });

    home.service('homeService', function ($http, getServerName) {

        var requestSvc = {};

        requestSvc.getProjects = function () {
            return $http({
                method: "GET",
                skipAuthorization: false,
                url: getServerName + "/projects/"
            });
        };

        requestSvc.createProject = function (project) {
            return $http({
                method: "POST",
                skipAuthorization: false,
                url: getServerName + '/projects/',
                data: project
            })
        };

        return requestSvc;
    })

})();
