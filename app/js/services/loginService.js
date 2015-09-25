'use strict';

app.factory('loginService', function ($http, $location) {
    return {
        login: function (user) {
            var $promise = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
            $promise.then(function (response) {
                $location.path('/home');
                $location.replace();
            }, function (response) {
                user.error = true;
            });
        }
    }

});