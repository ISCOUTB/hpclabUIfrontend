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
			login : function (user) {
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
})();