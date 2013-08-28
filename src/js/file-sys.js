var FileSys = function() {

	var fs = require('fs');
	var browseDialog = $('<input type="file"/>');
	var saveDialog = $('<input type="file" nwsaveas />');


	var obj = {
		open: function(path, callback) {
			if(typeof(callback) !== 'function')
				return;

			fs.readFile(path, 'utf8', function(err, data) {
				if(err) {
					console.log(err);
				} else {
					callback({
						data: data,
						path: path
					});
				}
			});
		},
		browse: function(callback) {
			browseDialog.off('change').change(function(e) {
				var filePath = $(e.currentTarget).val();
				if(filePath) {
					obj.open(filePath, callback);
				}
			}).click();
		},
		save: function(path, data, callback) {
			fs.writeFile(path, data, 'utf8', function(err) {
				if(err) {
					console.log(err);
				} else {
					if(typeof(callback) == 'function') {
						callback({
							path: path
						});
					}
				}
			});
		},
		saveAs: function(fileName, data, callback) {
			saveDialog.off('change').change(function(e) {
				var files = saveDialog[0].files;
				if(files.length > 0) {
					var file = files[0];
					obj.save(file.path, data, callback);
				}
			}).click();
		}
	};
	return obj;
};