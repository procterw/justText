angular.module("App")
.factory("NoteService", function() {

	var N = {};

	N.model = null;

	// No notebooks yet on load
	N.notebooks = [];

	// By default, no notebook
	N.notebook = { title:"" };

	N.setModel = function(note) {
		N.model = note;
		console.log(N.model);
	};

	N.newNotebook = function(title, callback) {
		var Notebook = Parse.Object.extend("Notebook");
		var notebook = new Notebook();
		notebook.set("parent", Parse.User.current());
		notebook.set("title", title);
		notebook.save().then(function(notebook) {
			callback({title: title, id:notebook.id});
		});
	};

	N.newNote = function(callback) {
		var Note = Parse.Object.extend("Note");
		var note = new Note();
		note.set("parent", Parse.User.current());
		note.set("title", "");
		note.set("body", "");
		note.set("notebook", N.notebook.title);
		note.save().then(function(note){
			N.model = {};
			N.model.title = "Untitled";
			N.model.body = "";
			N.model.notebook = N.notebook.title;
			callback(note.id);
		});
	};

	// Create the current note
	N.buildModel = function(id, callback) {

		// If the model already exists, like when a note is opened
		// from the main page, then just use that
		if (N.model) callback(N.model);

		var query = new Parse.Query("Note");
		query.get(id).then(function(note){
			// TODO is this necessary?
			if(note.get("parent").id !== Parse.User.current().id) {
				console.error("Note does not belong to current user");
			}
			N.model = {
				title: note.get("title"),
				body: note.get("body"),
				notebook: note.get("notebook"),
				id: note.id
			};
			callback(N.model);
		});
		// Is this note's owner logged in?
	};

	// Save changes to the currently open note
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