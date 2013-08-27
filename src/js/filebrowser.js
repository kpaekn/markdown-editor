var FileBrowser = function() {

	var fileDialog = $('<input type="file" value="init"/>');
	var browseCallback;

	fileDialog.change(function(e) {
		var filename = $(e.currentTarget).val();
		if(filename && typeof(browseCallback) == 'function') {
			browseCallback(filename);
			browseCallback = null;
		}
	});

	return {
		browse: function(callback) {
			browseCallback = callback;
			fileDialog.click();
		}
	};
}