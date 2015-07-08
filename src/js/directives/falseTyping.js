angular.module('App').
directive('falseTyping', [function() {
  return {
    restrict: 'A', // only activate on element attribute
    link: function(scope, element, attrs) {
      
      // Find text to retype
      var text = element.html();

      // Clear text
      element.html("");

      // Create a span for text and the flashing bar
      var body = angular.element(element.append("<span id='false-body'></span>").children()[[0]]);
      var bar = angular.element(element.append("<span id='false-bar'>|</span>").children()[[1]]);


      var i = 0;
      var timer = setInterval(function(){

      		// Update text by one character
      		var subText = text.slice(0,i);

      		// Set new text
      		body.html(subText);

      		// If finished stop typing and make
      		// the bar blink
      		if(subText === text) {
      			clearInterval(timer);
      			barBlink();
      		}

      		i++;

      }, 75);

      // Interval for the blinking bar at the end of text input
      function barBlink() {
      	setInterval(function() {

      		// Use opacity instead of removing the bar so centered
      		// text doesn't move around
      		var opacity = bar.css("opacity");

      		if (!opacity || opacity==="0") {
      			bar.css("opacity", 1);
      		} else {
      			bar.css("opacity", 0);
      		}

      	}, 600);
      }

    }
  };
}]);