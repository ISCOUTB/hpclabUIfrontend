'use strict';
(function () {
   var app = angular.module('app');

   /**
    * Factory Http Error Response Interceptor
    */

   app.factory('httpErrorResponseInterceptor', ['$q', '$location', '$localStorage',
		function ($q, $location, $localStorage) {
         return {
            request: function (config) {
               config.headers = config.headers || {};
               if ($localStorage.token) {
                  config.headers.Authorization = 'Bearer' + $localStorage.token;
               }
               return config;
            },
            response: function (responseData) {
               return responseData;
            },
            responseError: function error(response) {
               switch (response.status) {
               case 401:
                  $location.path('/login');
                  break;
               case 404:
                  $location.path('/404');
                  break;
               }

               return $q.reject(response);
            }
         };
		}
	]);

   /*
    *  Factory Authentication
    */

   app.factory('Auth', ['$http', '$localStorage', function ($http, $localStorage, urls) {
      function urlBase64Decode(str) {
         var output = str.replace('-', '+').replace('_', '/');
         switch (output.length % 4) {
         case 0:
            break;
         case 2:
            output += '==';
            break;
         case 3:
            output += '=';
            break;
         default:
            throw 'Illegal base64url string!';
         }
         return window.atob(output);
      }

      function getClaimsFromToken() {
         var token = $localStorage.token;
         var user = {};
         if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
         }
         return user;
      }

      var tokenClaims = getClaimsFromToken();

      return {
         login: function (data, success, error) {
            $http.post('/login', data).success(success).error(error)
         },
         logout: function (success) {
            tokenClaims = {};
            delete $localStorage.token;
            success();
         },
         getTokenClaims: function () {
            return tokenClaims;
         }
      };
	}]);


})();
