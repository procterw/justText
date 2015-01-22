angular.module("App")
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


});