angular.module('App', ['ui.router', 'textAngular', 'ngAnimate'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

  $urlRouterProvider.when("/note", "/note/:id");

  $stateProvider
  	.state("index", {
			url: "/",
			templateUrl: "templates/main.html"
		})
		.state("login", {
			url: "/",
			templateUrl: "templates/login.html",
			controller: "LoginCtrl"
		})
		.state("editor", {
			url: "/note/:id",
			templateUrl: "templates/editor.html",
			controller: "EditorCtrl"
		});
		

	$urlRouterProvider.otherwise("/");

}])

.run(['$rootScope', '$state', '$location', function ($rootScope, $state, $location) {
    $rootScope.$on('$locationChangeStart', function (event) {

    		// If no parse user, go to login
        if (!Parse.User.current()) {
            event.preventDefault();
            $state.go("login");
        }
        else {
        	// Go forth and conquer
        }

    });
}]);