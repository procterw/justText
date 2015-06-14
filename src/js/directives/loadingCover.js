angular.module('App').
directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    scope: {
      visible: "="
    },
    link: function(scope, element, attrs, ngModel) {
      

    }
  };
}]);