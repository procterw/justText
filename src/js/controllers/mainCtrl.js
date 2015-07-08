angular.module("App")
	.controller("MainCtrl", ["$scope", "$state", "UserService", "NoteService", function($scope, $state, UserService, NoteService) {

		$scope.isLoading = true;

		// search terms
		$scope.searchString = "";

		$scope.notebook = NoteService.notebook;

		$scope.notebookName = {
			name: ""
		};

		$scope.notebookTally = function(title) {
			if (!$scope.user) return;
			if (title === "all") return $scope.user.notes.length;
			var count = 0;
			for (var i=0; i<$scope.user.notes.length; i++) {
				if ($scope.user.notes[i].notebook === title) count++;
			}
			return (count);
		};

		$scope.openNote = function(note,id) {
			$state.go("editor", {id: id});
			NoteService.setModel(note);
		};

		$scope.newNote = function() {
			// change state to editor
			NoteService.newNote(function(id){
				$state.go("editor", {id: id});
			});
		};

		$scope.openNotebook = function(notebook) {
			if (!notebook) notebook = { title: "" };
			NoteService.notebook = notebook;
			$scope.notebook = notebook;
			// $scope.$apply();
		};

		$scope.newNotebook = function(title) {
			$scope.notebookName.name = "";
			$scope.user.notebooks.push({ title: title });
			$scope.notebook = { title: title };
			NoteService.newNotebook(title, function(notebook) {
				
			});
		};

		$scope.deleteNote = function(note, i) {
			UserService.deleteNote(note, i, function(model){
				
			});
		};

		$scope.deleteNotebook = function(notebook, i) {
			if (notebook.title == $scope.notebook.title) $scope.notebook = { title: "" };
			$scope.user.notebooks.splice(i, 1);
			UserService.deleteNotebook(notebook, i);
		};

		$scope.logout = function(){
			$state.go("login");
			$scope.user = null;
			UserService.logout(function(){
				
			});
		};

		$scope.$watch(function(){
			if (UserService.model) {
				return UserService.model.notes.length;
			}
		}, function(){
			if(Parse.User.current() && !$scope.user) {
				UserService.buildModel(Parse.User.current(), function(user) {
					$scope.user = UserService.model;
					$scope.isLoading = false;
					$scope.$apply();
				});
			}
		}, true);

}]);