angular.module("App")
	.controller("LoginCtrl", ["$scope", "$state", "UserService", function($scope, $state, UserService) {

		$scope.login = function() {
			Parse.FacebookUtils.logIn(null, "pass")
				.then(function(user){
					if(!user.existed()) {
	        	UserService.newUser(user, function(user){
	        		UserService.buildModel(user, function(user){
		        		$state.go("index");
		        	});
	        	});
	        } else {
	        	UserService.buildModel(user, function(user){
	        		$state.go("index");
	        	});
	        }
				});
		};


}]);