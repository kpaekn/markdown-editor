/**
 *	Setup Markdown Converter and
 *		  Codemirror Editor
 */
var preview = $('.markdown-preview');
var converter = new Markdown.Converter();
var codeMirror = CodeMirror(document.body, {
	lineNumbers: true,
	lineWrapping: true,
	mode: 'markdown',
	theme: 'twilight'
});
codeMirror.on('change', function(instance, obj) {
	preview.html(converter.makeHtml(instance.getValue()));
	fileHasChanged = true;
});

/**
 *	Make links open in external browser.
 */
preview.delegate('a', 'click', function(e) {
	e.preventDefault();
	var link = $(this),
		href = link.attr('href');
	if(href) {
		window.open(href);
	}
});

/**
 *	Setup FileSystem,
 *		  Menu bar,
 *		  Session data (save on close, load on open)
 */
var fileSys = new FileSys();
var currFile = localStorage.getItem('lastOpenedFile');
var fileHasChanged = false;
var gui = require('nw.gui');
var mainWindow = gui.Window.get();

if(currFile) {
	fileSys.open(currFile, function(obj) {
		codeMirror.setValue(obj.data);
		fileHasChanged = false;
	});
}
/*
 *	Set window initial state from previous session
 */
(function() {
	var maximized = localStorage.getItem('windowMaximized') == 'true';
	// Number(null) evaluates to 0, which is a falsy value
	var width = Number(localStorage.getItem('windowWidth'));
	var height = Number(localStorage.getItem('windowHeight'));
	if(maximized) {
		mainWindow.maximize();
	} else if(width && height) {
		mainWindow.moveBy(Math.floor((mainWindow.width - width) / 2), Math.floor((mainWindow.height - height) / 2));
		mainWindow.resizeTo(width, height);
	}
})();

mainWindow.on('close', function() {
	this.hide();
	if(currFile) {
		localStorage.setItem('lastOpenedFile', currFile);	
	} else {
		localStorage.removeItem('lastOpenedFile');
	}
	localStorage.setItem('windowWidth', mainWindow.width);
	localStorage.setItem('windowHeight', mainWindow.height);
	this.close(true);
});
mainWindow.on('maximize', function() {
	localStorage.setItem('windowMaximized', true);
});
mainWindow.on('unmaximize', function() {
	localStorage.removeItem('windowMaximized');
});

mainWindow.menu = createMenu(gui, [{
	label: 'File',
	submenu: [
		{
			label: 'New',
			click: newFile
		}, {
			label: 'Open',
			click: browseFile
		}, {
			label: 'Save',
			click: saveFile
		}, {
			label: 'Save As...',
			click: saveFileAs
		}, {
			type: 'separator'
		}, {
			label: 'Exit',
			click: exitApp
		}
	]
}], 'menubar');
$(document).keydown(function(e) {
	if(e.ctrlKey) {
		if(e.keyCode == 83) { // s
			if(e.shiftKey) { saveFileAs(); }
			else { saveFile(); }	
		} else if(e.keyCode == 79) { // o
			browseFile();
		} else if(e.keyCode == 78) { // n
			newFile();
		}
	}
	if(e.keyCode == 123) {
		mainWindow.showDevTools();
	}
});

function checkIfFileChanged(callback) {
	if(fileHasChanged) {
		Alert.create({
			text: 'Do you want to save you changes?',
			buttons: [{
				label: 'Save',
				click: function() {
					saveFile();
					if(typeof(callback) == 'function') {
						callback();
					}
				}
			}, {
				label: 'Don\'t Save',
				click: callback
			}, {
				label: 'Cancel'
			}]
		});
	} else {
		if(typeof(callback) == 'function') {
			callback();
		}
	}
}
function newFile() {
	checkIfFileChanged(function() {
		codeMirror.setValue('');
		currFile = null;
		fileHasChanged = false;
	});
}
function browseFile() {
	checkIfFileChanged(function() {
		fileSys.browse(function(obj) {
			codeMirror.setValue(obj.data);
			currFile = obj.path;
		});
	});
}
function saveFile() {
	if(currFile) {
		if(fileHasChanged) {
			fileSys.save(currFile, codeMirror.getValue(), postSave);	
		} else {
			postSave();
		}
	} else {
		saveFileAs();	
	}
}
function saveFileAs() {
	fileSys.saveAs('doc.md', codeMirror.getValue(), function(obj) {
		currFile = obj.path;
		postSave();
	});
}
function postSave() {
	Notify.create({ text: 'File saved.' });
	fileHasChanged = false;
}
function exitApp() {
	$('body').animate({ opacity: 0.2 }, 400, 'linear', function() {
		mainWindow.close();
	});
}
