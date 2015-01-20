angular.module("App")
	.controller("EditorCtrl", function($scope, $state) {

		$scope.params = $state.params;

});