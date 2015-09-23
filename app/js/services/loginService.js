'use strict';

app.factory('loginService', function ($http) {

   return {
      login: function (user) {
         var $url=$http.post("http://172.16.9.170:9000/api-token-auth/",user);
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