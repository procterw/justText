// Utilities for the current Parse user. Builds models and saves / retrieves objects to/from Parse.

angular.module("App")
	.factory("UserService", function() {

	// make an example snippet
	function makeSnippet(str) {
		var div = document.createElement("div");
		div.innerHTML = str;
		var snip = "";

		angular.forEach(angular.element(div).children(), function(c) {
			snip += " " + (c.textContent || c.innerText || "");
		});
		snip = snip.replace(/\s\s+/g, ' ');
		snip = snip.substring(0,50);
		if (snip.length > 49) snip += "...";
		return snip;
	}

	var P = {};

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
			P.model.notebooks = [];
			angular.forEach(notes, function(n){
				var note = {
					title: n.get("title"),
					body: n.get("body"),
					notebook: n.get("notebook"),
					id: n.id
				};
				note.snippet = makeSnippet(note.body);
				P.model.notes.push(note);
			});

			// Now get notebooks
			query = new Parse.Query("Notebook");
			query.equalTo("parent", user);
			query.find().then(function(notebooks){
				angular.forEach(notebooks, function(n) {
					P.model.notebooks.push({
						title: n.get("title"),
						id: n.id
					});
				});
				callback(P.model);
			});

			
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
		note.snippet = makeSnippet(note.body);
		console.log(note);
		var index = -1;
		angular.forEach(P.model.notes, function(n, i) {
			if (note.id == n.id) { index = i; }
		});
		if (index > -1) {
			P.model.notes[index] = note;
		} else {
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

	P.deleteNotebook = function(notebook, i, callback) {
		if (i > -1) { P.model.notebooks.splice(i, 1); }
		var query = new Parse.Query("Notebook");
		query.get(notebook.id).then(function(notebook) {
			notebook.destroy();
		});
	};

	// refreshUser();

	return P;

});