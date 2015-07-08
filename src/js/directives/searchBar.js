angular.module('App')
  .directive('searchBar', function() {

    return {
      restrict: 'E',
      template: '<span class="search"><input ng-model="searchString"></input><i class="material-icons search-icon">search</i></span>',
      link: function(scope, iElement, iAttrs, ctrl) {

      	var children = angular.element(iElement).children().children();
      	angular.element(children[0]).on("click", function() {
      		angular.element(children[1]).addClass("rotate");
      		setTimeout(function() {
      			angular.element(children[1]).removeClass("rotate");
      		}, 300);
      		
      	});

      }
    };

  });