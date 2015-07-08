angular.module('App').filter('searchFilter', function() {
  return function(input, searchString) {

   if (!searchString.body) {
   	return input;
   } else {
   	var test = input.filter(function(a) {
   		return a.body.toLowerCase().indexOf(searchString.body.toLowerCase()) > -1;
   	});
   	return test;
   }
   
   //  if (input.body.indexOf(searchString) > -1) {
   //  	return input;
   //  } else {
   //  	return false;
   //  }
  };
});