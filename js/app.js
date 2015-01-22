angular.module('App', ["ui.router"])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){

  $urlRouterProvider.when("/note", "/note/:id")

  $stateProvider
		.state("login", {
			url: "",
			templateUrl: "templates/login.html",
			controller: "LoginCtrl"
		})
		.state("editor", {
			url: "/note/:id",
			templateUrl: "templates/editor.html",
			controller: "EditorCtrl"
		})
		.state("index", {
			url: "/",
			templateUrl: "templates/main.html"
		});

	$urlRouterProvider.otherwise("/");

})

.run(['$rootScope', '$state', '$location', function ($rootScope, $state, $location) {
    $rootScope.$on('$locationChangeStart', function (event) {

    		// If no parse user, go to login
        if (!Parse.User.current()) {
            event.preventDefault();
            $state.go("login")
        }
        else {
        	// Go forth and conquer
        }

    });
}]);