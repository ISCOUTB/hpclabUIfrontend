'use strict';

app.controller('loginController', function ($scope, loginService, $mdToast) {

    $scope.login = function (user) {
        loginService.login(user);
    };

});