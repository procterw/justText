angular.module("App")
.factory("NoteService", function($rootScope) {

	var N = {};

	var model = null;

	N.setActive = function(note) {
		model = {
			title: note.title,
			id: note.id
		}
	}

	N.getActive = function() {
		return model;
	}

	return N;

});