var preview = $('.markdown-preview');

// markdown converter
var converter = new Markdown.Converter();

var codeMirror = CodeMirror(document.body, {
	mode: 'markdown',
	theme: 'twilight'
});
codeMirror.on('change', function(instance, obj) {
	preview.html(converter.makeHtml(instance.getValue()));
});

var currentFile;
var fileBrowser = new File.Browser();
var fileSaver = new File.Saver();
var menuFunctions = {
	openFile: function() {
		fileBrowser.browse(function(path) {
			console.log(path);
			currentFile = path;
		});	
	},
	saveFile: function() {
		// if is an existing file
		// straight up save
		// else
		menuFunctions.saveFileAs();
	},
	saveFileAs: function() {
		fileSaver.save('doc.md', codeMirror.getValue());
	},
	exitApp: function() {
		$('body').animate({ opacity: 0.2 }, 400, 'linear', function() {
			gui.App.quit();
		});
	}
}

var gui = require('nw.gui');
gui.Window.get().menu = createMenu(gui, [{
	label: 'File',
	submenu: [
		{
			label: 'New'
		}, {
			label: 'Open',
			click: menuFunctions.openFile
		}, {
			label: 'Save',
			click: menuFunctions.saveFile
		}, {
			label: 'Save As...',
			click: menuFunctions.saveFileAs
		}, {
			type: 'separator'
		}, {
			label: 'Exit',
			click: menuFunctions.exitApp
		}
	]
}], 'menubar');