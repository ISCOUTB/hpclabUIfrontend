'use strict';

app.factory('loginService', function ($http, $window) {

   return {
      login: function (user) {
         var $url = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
         //var $url=$http.post("data/user.php",user);

         $url.then(function (msj) {

            if (msj.status == 200) {
               console.log(msj.data);
               $window.location.href = '/home';
            } else {
               $window.location.href = '/error';
               console.log(msj.data);


            }
         });
      }
   }
});