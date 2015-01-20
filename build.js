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

	

});angular.module("App")
	.controller("EditorCtrl", function($scope, $state) {

		$scope.params = $state.params;

});angular.module("App")
	.controller("MainCtrl", function($scope, $state, $location, UserService, NoteService) {

		$scope.login = function() {
			Parse.FacebookUtils.logIn(null, "pass")
				.then(function(user){
					if(!user.existed()) {
	        	UserService.newUser(user, function(user){
	        		UserService.buildModel(user, function(user){
		        		$scope.user = UserService.model;
		        		$scope.$apply();
		        	})
	        	});
	        } else {
	        	UserService.buildModel(user, function(user){
	        		$scope.user = UserService.model;
	        		$scope.$apply();
	        	})
	        }
	        $state.go("index")
				});
		};

		// search terms
		$scope.searchString = "";

		$scope.notes = [
			{title: "Note1", id:"84dfrhsi8tyurh8h", sample: "This, of course, was the first note, of course, a horse..."},
			{title: "Note2", id:"475uyrsfhwes47ts", sample: "This one is a recipe Onions Tomato 6 Apples 1 Can of..."}
		]

		// 
		$scope.newNote = function() {
			// change state to editor
		}

		$scope.logout = function(){
			$scope.user = null;
			UserService.logout();
		}

		// $scope.deleteLog = function(log) {

		// 	// Remove log from model
		// 	angular.forEach($scope.user.logs, function(l, i) {
		// 		if (log.id === l.id) {
		// 			$scope.user.logs.splice(i, 1);
		// 		}
		// 	})

		// 	// Remove log from server
		// 	var Log = Parse.Object.extend("Log");
		// 	var query = new Parse.Query(Log);
		// 	query.get(log.id, "pass").then(function(log) {
		// 		log.destroy();
		// 	})
		// }


		// If no model exists AND a user logs in build a user model
		if(UserService.model === null && Parse.User.current()) {
			UserService.buildModel(Parse.User.current(), function(user) {
				$scope.user = UserService.model;
				$scope.$apply();
			})
		}

		// Reroute on route change
		$scope.$on('$locationChangeStart', function(event) {
			if($scope.user || Parse.User.current()) {
			} else {
				$state.go("login");
			}
		});

		// Reroute on user change
		$scope.$watch("user", function(user, old) {
			if(user || Parse.User.current()) {
			} else {
				$state.go("login");
			}
		});

});angular.module("App")
	.controller("ViewNotebookCtrl", function($scope, $state, NotebookService) {

		$scope.params = $stateParams;

});angular.module("App")
.factory("NoteService", function($rootScope) {

	var N = {};

	var model = null;

	N.setActive = function(note) {
		model = {
			title: note.title,
			id: note.id
		}
	}

	N.getActive = function() {
		return model;
	}

	return N;

});angular.module("App")
.factory("NotebookService", function($rootScope) {

	var N = {};


	return N;

});// Utilities for the current Parse user. Builds models and saves / retrieves objects to/from Parse.

angular.module("App")
	.factory("UserService", function() {

	var P = {};

	// Create a new user. Get name from Facebook, set blank array of logs
	P.newUser = function(user, callback) {
		FB.api(
	    "/me",
	    function (response) {
	      if (response && !response.error) {
	        user.set("name", response.first_name);
	        user.save().then(function(){
	        	callback(user)
	        })
	      }
	    }
		)
	}

	P.model = null;

	// Build a user model given a Parse user
	P.buildModel = function(user, callback) {
		// Get properties from user
		P.model = {};
		P.model.name = user.get("name");
		P.model.id = user.id;
	}

	P.logout = function() {
    FB.getLoginStatus(function(response) {
	    if (response && response.status === 'connected') {
        FB.logout(function(response) {
        	Parse.User.logOut()
	    		P.model = null;
          document.location.reload();
        });
	    }
    });
	};

	// refreshUser();

	return P;

});