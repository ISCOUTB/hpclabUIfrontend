'use strict';

app.factory('loginService', function ($http,$location) {

   return {
      login: function (user) {
         var $url = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
         //var $url=$http.post("data/user.php",user);

         $url.then(function (msj) {

            if (msj.status == 200) {
               console.log(msj.data);
               $location.path('/home');
               $location.replace();
            } else {
               $location.path('/error');
               $location.replace();
               console.log(msj.data);


            }
         });
      }
   }
});