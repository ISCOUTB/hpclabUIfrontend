'use strict';

app.factory('loginService', function ($http, $location) {
    return {
        login: function (user) {
            var $promise = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);

            $promise.then(function (response) {
                //Angel!!!! please save token on local storage here !
                console.log(response.data);
                $location.path('/home');
                $location.replace();
            }, function (response) {
                console.log('Error', response.status);
                $location.path('/error');
                $location.replace();
            });
        }
    }

});