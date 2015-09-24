'use strict';

app.controller('loginController', function ($scope, loginService, $timeout) {

    $scope.login = function (user) {
        loginService.login(user);
    };

    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            componentHandler.upgradeAllRegistered();
        });
    });

});