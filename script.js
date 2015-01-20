var myapp = angular.module('App', ["ui.router"]);
    
myapp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state("login", {
			url: "/login",
			templateUrl: "templates/login.html"
		})
		.state("/", {
			url: "/",
			templateUrl: "templates/main.html"
		});

});

myapp.controller("MainCtrl", function($scope, ParseFactory, $state, $location) {

	$scope.login = ParseFactory.login;

	$scope.logout = ParseFactory.logout;

	$scope.user = ParseFactory.Parse.User.current;

	$scope.logList = [];

	$scope.newLog = null;

	var refreshLogList = function() {
		if($scope.user()) {
			var query = new ParseFactory.Parse.Query("Log");
			query.equalTo('userId', $scope.user().id);
			query.find({
				success: function(results) {
					$scope.logList = [];
					angular.forEach(results, function(r) {
						$scope.logList.push(r);
					});
					$scope.$apply();
				},
				error: function(results, error) {
					console.log(error);
				}
			});
		}
	};

	$scope.$on('logAdded', function(){
		refreshLogList();
	});

	$scope.$watch(function(){ return $state.current; }, function(nw, old){
		if(nw !== old) {
			if($state.current.name === "login" && $scope.user()) {
				$state.go("/");
			}
		}
	});

	$scope.$watch("user()", function(user, old) {
		if (user !== old || !user) {
			if(user) {
				$state.go("/");
			} else {
				$location.path("/login");
			}
		}
		refreshLogList();
	});

});

myapp.controller("NewLogCtrl", function($scope, $q, ParseFactory) {

	// Initialize classes
	var Log = ParseFactory.Parse.Object.extend("Log");
	var Property = ParseFactory.Parse.Object.extend("Property");

	// Reset the UI fields
	var reset = function() {
		$scope.log = {
		title: "title",
			properties: [{name:"name", type:"text"}]
    };
	};

	// initial log object
	reset();

	// add a property to log
	$scope.add = function() {
		$scope.log.properties.push({name:"name", type:"text"});
	};

	$scope.cancel = function() {
		reset();
		$scope.$emit("logAdded");
	};

	// Process everything
	$scope.close = function() {

		var log = new Log();
		log.set("title", $scope.log.title);
		log.set("userId", ParseFactory.user.id);

		var promises = [];
		angular.forEach($scope.log.properties, function(p, i) {
			var prop = new Property();
			prop.set("name", p.name);
			prop.set("type", p.type);
			promises.push(prop.save());
		});

		$q.all(promises).then(function(values) {
			log.set("properties", values);
			log.save().then(function(log){
				$scope.$parent.newLog = false;
				ParseFactory.newLog(log);
				$scope.log = { title: "title", properties: [{name:"name", type:"text"}]};
				$scope.$emit("logAdded");
			});
		});
		
	};

});



myapp.factory("ParseFactory", function($rootScope) {

	// Initialize return
	var P = {};

	// Start Parse up
	

	// Reference to Parse
	P.Parse = Parse;

	// Create a new user. Get name from Facebook, set blank array of logs
	function newUser(user) {
		FB.api(
	    "/me",
	    function (response) {
	      if (response && !response.error) {
	        user.set("name", response.first_name);
	        user.relation("logs");
	        user.save();
	        P.user = user;
	      }
	    }
		);	
	}

	// Initialize user as cached User
	P.user = Parse.User.current();

	// Fetch the latest data for user and update the $rootScope
	function refreshUser() {
		if(P.user) {
			Parse.User.current().fetch({
				success: function(user) {
					P.user = user;
					$rootScope.$apply();
				}
			});
		}
	}


	// External function for facebook login.
	P.login = function() {
		Parse.FacebookUtils.logIn(null, {
      success: function(user) {
        if (!user.existed()) {
        	newUser(user);
        }
    		$rootScope.$apply();
      },
      error: function(user, error) {
      	console.log("User cancelled the Facebook login or did not fully authorize.");
      }
    });
	};

	// Add a log to the User's logbook
	P.newLog = function(log) {
		Parse.User.current().fetch({
			success: function(user) {

				log.save({
					success: function(log) {
						user.add("logs", log);
						user.save();
					}
				});
				
			}
		});
	};

	P.logout = function() {
		Parse.User.logOut();
		FB.logout();
	};


  refreshUser();

	return P;

});

