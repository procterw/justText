angular.module("App")
.factory("NoteService", function() {

	var N = {};

	N.model = null;

	N.newNote = function(callback) {
		var Note = Parse.Object.extend("Note");
		var note = new Note();
		note.set("parent", Parse.User.current());
		note.set("title", "");
		note.set("body", "");
		note.save().then(function(note){
			N.model = {};
			N.model.title = "";
			N.model.body = "";
			callback(note.id);
		});
	};

	N.buildModel = function(id, callback) {

		var query = new Parse.Query("Note");
		query.get(id).then(function(note){
			// TODO is this necessary?
			if(note.get("parent").id !== Parse.User.current().id) {
				console.error("Note does not belong to current user");
			}
			N.model = {
				title: note.get("title"),
				body: note.get("body"),
				id: note.id
			};
			callback(N.model);
		});
		// Is this note's owner logged in?
	};

	N.save = function(note, callback) {
		var title = note.title,
				body = note.body;
		var query = new Parse.Query("Note");
		query.get(note.id).then(function(n){
			n.set("title", title);
			n.set("body", body);
			n.save().then(function(note){
				callback(note);
			});
		});
	};

	// TODO constructor?
	// var Note = function()

	return N;

});