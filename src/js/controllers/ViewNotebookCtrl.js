angular.module("App")
	.controller("ViewNotebookCtrl", ['$scope', '$state', 'NotebookService', function($scope, $state, NotebookService) {

		$scope.params = $stateParams;

}]);