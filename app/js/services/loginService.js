'use strict';

app.factory('loginService', function ($http) {

   return {
      login: function (user) {
         var $url=$http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/",user);
         //var $url=$http.post("data/user.php",user);
         
         $url.then(function (msj){
            
            if(msj.data=='exito'){
               console.log('SIIIII');
            }else{
               console.log('NOOOOO');
            }
         });
      }
   }
});