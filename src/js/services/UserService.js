// Utilities for the current Parse user. Builds models and saves / retrieves objects to/from Parse.

angular.module("App")
	.factory("UserService", function() {

	var P = {};

	var removeTags = function(text) {
		return text;
	};

	// Create a new user. Get name from Facebook, set blank array of logs
	P.newUser = function(user, callback) {
		FB.api(
	    "/me",
	    function (response) {
	      if (response && !response.error) {
	        user.set("name", response.first_name);
	        user.save().then(function(){
	        	callback(user);
	        });
	      }
	    }
		);
	};

	P.model = null;

	// Build a user model given a Parse user
	P.buildModel = function(user, callback) {
		// Get properties from user
		var query = new Parse.Query("Note");
		query.equalTo("parent", user);
		query.find().then(function(notes){
			P.model = {};
			P.model.name = user.get("name");
			P.model.id = user.id;
			P.model.notes = [];
			angular.forEach(notes, function(n){
				var note = {
					title: n.get("title"),
					body: n.get("body"),
					id: n.id,
				};
				note.snippet = removeTags(note.body).substring(0,25);
				// note.title = note.title || "Untitled Note";
				P.model.notes.push(note);
			});
			callback(P.model);
		});
		
	};

	P.logout = function(callback) {
    FB.getLoginStatus(function(response) {
	    if (response && response.status === 'connected') {
        FB.logout(function(response) {
        	Parse.User.logOut();
	    		P.model = null;
	    		callback();
        });
	    }
    });
	};

	// Save note changes to model
	P.saveNote = function(note) {
		var index;
		angular.forEach(P.model.notes, function(n, i) {
			if (note.id == n.id) { index = i; }
		});
		if (index) {
			note.snippet = note.body.substring(0,25);
			P.model.notes[index] = note;
		} else {
			note.snippet = removeTags(note.body).substring(0,25);
			P.model.notes.push(note);
		}
	};

	P.deleteNote = function(note, i, callback) {
		if (i > -1) { P.model.notes.splice(i, 1); }
		var query = new Parse.Query("Note");
		query.get(note.id).then(function(note){
			note.destroy();
		});
	};

	// refreshUser();

	return P;

});