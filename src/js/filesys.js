var Filesys = function() {

	var fs = require('fs');
	var browseDialog = $('<input type="file"/>');
	var saveDialog = $('<input type="file" nwsaveas />');

	var obj = {
		open: function(path, callback) {
			if(typeof(callback) !== 'function')
				return;

			fs.readFile(path, 'utf8', function(err, data) {
				var resp = {
					data: data,
					path: path
				};
				if(err) resp.error = err;
				callback(resp)
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
		saveAs: function(data, callback) {
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