'use strict';

app.controller('loginController', function ($scope, loginService) {

   $scope.login = function (user) {
      loginService.login(user);
   }
});