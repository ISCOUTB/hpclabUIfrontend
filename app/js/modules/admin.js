/**
 * Created by juan on 19/11/15.
 */
'use strict';

(function () {
   var admin = angular.module('adminmodule', []);

   admin.controller('AdminController', function ($scope, adminService, $location, $stateParams, $state) {
      //Control Scroll

      $('.scrollspy').scrollSpy();
      $('.collapsible').collapsible();
      $('select').material_select();


      $scope.tools = [];
      adminService.getUser().then(function (result) {
         if (!result.data.is_staff) {
            $location.path('/');
            Materialize.toast('No tienes permiso para acceder a este sitio.', 4000, 'rounded')
         }
         $scope.user = result.data;
      });

      adminService.getTools().then(function (result) {
         $scope.tools = result.data;
         if($scope.tools.length > 0){
            $state.go('admin.tool', {toolID: (_.head($scope.tools)).id});
         }
      });

      $scope.createTool = function (tool) {
         adminService.createTool(tool).then(function (result) {
            $scope.tools.push(result.data);
            $scope.newTool = {};
            $scope.ToolForm.$setPristine();
            $scope.ToolForm.$setUntouched();
            $("#newToolModal").closeModal();
         })
      };

   });

   admin.service('adminService', function ($http, getServerName) {

      var requestSvc = {};

      requestSvc.getUser = function () {
         return $http({
            method: "GET",
            skipAuthorization: false,
            url: getServerName + "/user/"
         })
      };

      requestSvc.getTools = function () {
         return $http({
            method: "GET",
            skipAuthorization: false,
            url: getServerName + "/tools/"
         })
      };

      requestSvc.createTool = function (tool) {
         return $http({
            method: "POST",
            skipAuthorization: false,
            url: getServerName + "/tools/",
            data: tool
         })
      };

      return requestSvc;

   });

})();
