'use strict';
(function () {
	var factories = angular.module('factories', ['angular-jwt']);
	var lodash = angular.module('lodash',[]);

	lodash.factory('_', function(){
		return window._;
	});

	factories.factory('httpErrorResponseInterceptor', ['$q', '$location',
		function ($q, $location) {
			return {
				request       : function (config) {
					config.headers = config.headers || {};
					var token = localStorage.getItem('token');
					if (token) {
						config.headers.Authorization = 'Bearer ' + token;
					}
					return config;
				},
				response      : function (responseData) {
					return responseData;
				},
				responseError : function error(response) {
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

	factories.factory('Auth', ['$http', 'jwtHelper', function ($http, jwtHelper) {
		function getClaimsFromToken() {
			var token = localStorage.getItem('token');
			var user = {};
			user = jwtHelper.decodeToken(token);
			return user;
		}

		var tokenClaims = getClaimsFromToken();

		return {
			login          : function (data, success, error) {
				$http.post('/login', data).success(success).error(error)
			},
			logout         : function (success) {
				tokenClaims = {};
				delete localStorage.removeItem('token');
				success();
			},
			getTokenClaims : function () {
				return tokenClaims;
			}
		};
	}]);

	factories.service('getToken', function () {
		var token = localStorage.getItem('token');
		return token;
	});

	factories.factory('getServerName', function () {
		//return 'http://0.0.0.0:9000';
		//return 'http://192.168.172.130:9000';
		return 'https://api.hpclab.unitecnologica.edu.co';
	});

})();
