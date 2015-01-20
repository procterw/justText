angular.module("App")
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

});