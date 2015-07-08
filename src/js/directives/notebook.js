angular.module('App')
  .directive('notebook', function() {

    return {
      restrict: 'E',
      priority: 1001,
      scope: {
        "notebook": "="
      },
      template: ' <div ng-repeat="nbook in user.notebooks" ng-click="openNotebook(nbook)">{{nbook.title}}<span class="delete"><i class="material-icons icon">delete</i></span></div>',
      link: function(scope, iElement, iAttrs, ctrl) {

      	angular.element(iElement).on("mouseover", function() {
          console.log("LETS GO");
        });

      }
    };

  });