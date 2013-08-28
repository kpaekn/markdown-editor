var File = {};
File.Browser = function() {

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
};

File.Saver = function() {
	var fileDialog = $('<input type="file" nwsaveas />');
	fileDialog.change(function(e) {
		console.log(fileDialog[0].files);
	});

	return {
		save: function(filename, data) {
			fileDialog.off('change').change(function(e) {
				var files = fileDialog[0].files;
				if(files.length == 1) {
					var file = files[0];
					console.log(file);
					console.log('saving file to "' + file.path + '"');
				}
			});
			fileDialog.click();
		}
	};
};