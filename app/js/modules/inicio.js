'use strict';

(function () {
   var home = angular.module('homemodule', []);

   home.controller('HomeController', function ($scope, $rootScope, homeService, Auth, $location) {


      $scope.projects = [];

      homeService.getProjects().then(function (result) {
         $scope.projects = result.data;
      });

      $scope.createProject = function (project) {
         homeService.createProject(project).then(function (result) {
            $scope.projects.push(result.data);
            $scope.project = {};
            $scope.ProjectForm.$setPristine();
            $scope.ProjectForm.$setUntouched();
            $("#newProjectModal").closeModal();
            Materialize.toast("Creación de proyecto exitosa.", 4000, 'rounded');

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
