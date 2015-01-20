angular.module("App")
	.controller("ViewNotebookCtrl", function($scope, $state, NotebookService) {

		$scope.params = $stateParams;

});