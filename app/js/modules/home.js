'use strict';

(function () {
   var home = angular.module('homemodule',[]);

   home.controller('HomeController', function ($scope, requestService) {
      $scope.sendRequest = function () {
         requestService.info().then(function (result) {
            console.log(result.data);
         });
      }
   });

   home.service('requestService', function ($http, getServerName) {
      var requestSvc = {};
      requestSvc.info = function (token) {
         return $http({
            method: "GET",
            skipAuthorization:false,
            url: getServerName+"/projects/"
         });
      }

      return requestSvc;
   })

})();
