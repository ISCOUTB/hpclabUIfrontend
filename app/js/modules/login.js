'use strict';

(function () {
	var login = angular.module('loginmodule', []);

	login.controller('loginController', function ($scope, loginService) {
		$scope.login = function (user) {
			loginService.login(user);
		}
	});

	login.factory('loginService', function ($http, $location) {

		return {
			login: function (user) {
				var $promesa = $http.post("http://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
				//var $url=$http.post("data/user.php",user);

				$promesa.then(function (msj) {
					console.log(msj.data);
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
})();