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
}]);angular.module("App")
	.controller("EditorCtrl", function($scope, $state, NoteService) {

		// $scope.params = $state.params;

		NoteService.buildModel($state.params.id, function(note) {
			$scope.note = note;
			$scope.$apply();
		});

		$scope.back = function() {
			clearInterval(TI);
			NoteService.save($scope.note, function(){
				console.log("saved")
				$scope.note = null;
			});
			$state.go("index");
		};

		var TI;

		(function(){
			var note = angular.copy($scope.note);
			TI = setInterval(function(){
				if (JSON.stringify(note) !== JSON.stringify($scope.note)) {
					NoteService.save($scope.note, function(){
						console.log("saved")
					});
				}
				note = angular.copy($scope.note);
			}, 2000)
		})();
		
		

});angular.module("App")
	.controller("ViewNotebookCtrl", function($scope, $state, NotebookService) {

		$scope.params = $stateParams;

});angular.module("App")
	.controller("LoginCtrl", function($scope, $state, UserService) {

		$scope.login = function() {
			Parse.FacebookUtils.logIn(null, "pass")
				.then(function(user){
					if(!user.existed()) {
	        	UserService.newUser(user, function(user){
	        		UserService.buildModel(user, function(user){
		        		$state.go("index")
		        	})
	        	});
	        } else {
	        	UserService.buildModel(user, function(user){
	        		$state.go("index")
	        	})
	        }
				});
		};


});angular.module("App")
	.controller("MainCtrl", function($scope, $state, $location, $rootScope, UserService, NoteService) {

		// search terms
		$scope.searchString = "";

		// $scope.notes = [
		// 	{title: "Note1", id:"84dfrhsi8tyurh8h", sample: "This, of course, was the first note, of course, a horse..."},
		// 	{title: "Note2", id:"475uyrsfhwes47ts", sample: "This one is a recipe Onions Tomato 6 Apples 1 Can of..."}
		// ]

		// 
		$scope.newNote = function() {
			// change state to editor
			NoteService.newNote(function(id){
				$state.go("editor", {id: id})
			});
		}

		$scope.logout = function(){
			$state.go("login")
			$scope.user = null;
			UserService.logout(function(){
				
			});
		}

		$scope.$watch(function(){
			return UserService.model;
		}, function(nw, old){
			if(Parse.User.current() && !$scope.user) {
				UserService.buildModel(Parse.User.current(), function(user) {
					$scope.user = UserService.model;
					$scope.$apply()
				})
			}
		}, true)

		// if(UserService.model === null && Parse.User.current()) {
			
		// }


});angular.module("App")
.factory("NoteService", function($rootScope) {

	var N = {};

	N.model = null;

	N.newNote = function(callback) {
		var Note = Parse.Object.extend("Note");
		var note = new Note();
		note.set("parent", Parse.User.current());
		note.set("title", "");
		note.set("body", "");
		note.save().then(function(note){
			N.model = {};
			N.model.title = "";
			N.model.body = "";
			callback(note.id)
		})
	}

	N.buildModel = function(id, callback) {

		var query = new Parse.Query("Note");
		query.get(id).then(function(note){
			// TODO is this necessary?
			if(note.get("parent").id !== Parse.User.current().id) {
				console.error("Note does not belong to current user");
			}
			N.model = {
				title: note.get("title"),
				body: note.get("body"),
				id: note.id
			}
			callback(N.model)
		})
		// Is this note's owner logged in?
	}

	N.save = function(note, callback) {
		var title = note.title,
				body = note.body
		var query = new Parse.Query("Note");
		query.get(note.id).then(function(n){
			n.set("title", title);
			n.set("body", body);
			n.save().then(function(note){
				callback(note)
			})
		})
	}

	// TODO constructor?
	// var Note = function()

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
		var query = new Parse.Query("Note");
		query.equalTo("parent", user);
		query.find().then(function(notes){
			console.log(notes)
			P.model = {};
			P.model.name = user.get("name");
			P.model.id = user.id;
			P.model.notes = [];
			angular.forEach(notes, function(n){
				P.model.notes.push({
					title: n.get("title"),
					body: n.get("body"),
					id: n.id
				})
			})
			callback(P.model)
		})
		
	}

	P.logout = function(callback) {
    FB.getLoginStatus(function(response) {
	    if (response && response.status === 'connected') {
        FB.logout(function(response) {
        	Parse.User.logOut()
	    		P.model = null;
	    		callback()
        });
	    }
    });
	};

	// refreshUser();

	return P;

});