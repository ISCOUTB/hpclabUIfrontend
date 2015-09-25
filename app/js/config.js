var configuracion = function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

	$ocLazyLoadProvider.config({
		enabled     : true,
		requireBase : false
	});

	$stateProvider
		.state('login', {
			url         : '/login',
			templateUrl : 'partials/login.html',
			controller  : 'loginController',
		})
		.state('home', {
			url         : '/home',
			templateUrl : 'partials/home.html'
		});

	$urlRouterProvider.otherwise("/login");

	if (window.history && window.history.pushState) {
		$locationProvider.html5Mode({
			enabled     : true,
			requireBase : false
		});
	}
};

angular.module('app').config(configuracion);