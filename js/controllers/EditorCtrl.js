angular.module("App")
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
		
		

});