angular.module("App")
	.controller("EditorCtrl", ["$scope", "$state", "NoteService", "UserService", function($scope, $state, NoteService, UserService) {

		$scope.isLoading = true;

		NoteService.buildModel($state.params.id, function(note) {
			$scope.note = note;
			$scope.isLoading = false;
		});

		// When you go back, clear the time interval
		// Save the note to the server and to the user model
		$scope.back = function() {
			clearInterval(TI);
			UserService.saveNote($scope.note);
			NoteService.save($scope.note, function(){
				$scope.note = null;
			});
			$state.go("index");
		};

		var TI;

		(function(){
			var note = angular.copy($scope.note);
			TI = setInterval(function(){
				if (JSON.stringify(note) !== JSON.stringify($scope.note)) {
					UserService.saveNote($scope.note);
					NoteService.save($scope.note, function(){ });
				}
				note = angular.copy($scope.note);
			}, 10000);
		})();
		
		

}]);