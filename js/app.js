angular.module('App', ["ui.router"])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){


	// $urlRouterProvider.when("", "/index");

  $urlRouterProvider.when("/note", "/note/:id")
  .when("/", "/index")

  $stateProvider
		.state("login", {
			url: "",
			templateUrl: "templates/login.html"
		})
		.state("editor", {
			url: "/note/:id",
			templateUrl: "templates/editor.html",
			controller: "EditorCtrl"
		})
		.state("index", {
			url: "/index",
			templateUrl: "templates/main.html"
		});

	$urlRouterProvider.otherwise("/");

	

});