'use strict';

app.factory('loginService', function ($http, $location) {

   return {
      login: function (user) {
         var $promesa = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
         //var $url=$http.post("data/user.php",user);

         $promesa.then(function (msj) {

            if (msj.status == 400) {
               console.log(msj.data);
               $location.path('/home');
               $location.replace();
            } else {
               $location.path('/error');
               $location.replace();
               console.log(msj.data);
            }
         }, function (response) {
            console.log('Error', response.status);
         });
      }
   }
});