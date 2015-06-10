angular.module('App').
directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    scope: {
      selected: "="
    },
    link: function(scope, element, attrs, ngModel) {
      
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || '<p><br></p>'));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });

      element.on('click', function(e) {
        var node = angular.element(e.target);
      });

      element.on('keyup', function(e) {
        var node = angular.element(window.getSelection().anchorNode).parent();

        // ENTER
        if(event.keyCode == 13) {
          var newSpan = angular.element(window.getSelection().anchorNode);
        }

      });

      // Keydown
      element.on('keydown', function(e) {
        // Enter key
        if(event.keyCode == 13) {
          document.execCommand('formatBlock', false, 'p');
          return;
        }
        // Delete key
        if(event.keyCode == 8) {
          if(element.text() < 1) {
            event.preventDefault();
            return;
          }
        }
      });

      element.on('keypress', function(e){
        
      });

      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }

    }
  };
}]);