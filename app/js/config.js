var configuracion = function ($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
		.state('login',{
			url : '/login',
			templateUrl : 'partials/login.html',
			controller :  "loginController"
		})
		.state('home', {
			url : '/home',
			templateUrl: 'partials/home.html'
		});

	/*$stateProvider.when('/', {
		templateUrl: 'partials/login.html',
		controller: 'loginController'
	});

	$stateProvider.when('/home', {
		templateUrl: 'partials/home.html'
	});

	$stateProvider.when('/error', {
		templateUrl: 'partials/error.html'
	});

	$stateProvider.otherwise({
		redirecTo: '/'
	});*/

	if (window.history && window.history.pushState) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}
};

app.config(configuracion);