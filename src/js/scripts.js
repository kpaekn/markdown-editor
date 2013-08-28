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

/*
 * load last opened file
 */
if(currFile) {
	fileSys.open(currFile, function(resp) {
		if(resp.error) {
			newFile();
		} else {
			codeMirror.setValue(resp.data);
			fileHasChanged = false;	
		}
	});
}
/*
 *	Set window initial state from previous session
 */
(function() {
	// Number(null) evaluates to 0, which is a falsy value
	var width = Number(localStorage.getItem('window.width'));
	var height = Number(localStorage.getItem('window.height'));
	
	if(width && height) {
		if(width > window.screen.availWidth && height > window.screen.availHeight) {
			mainWindow.maximize();
		} else {
			mainWindow.moveBy(Math.floor((mainWindow.width - width) / 2), Math.floor((mainWindow.height - height) / 2));
			mainWindow.resizeTo(width, height);		
		}
	}
})();

/*
 *	Save state.
 */
mainWindow.on('close', function() {
	this.hide();
	if(currFile) {
		localStorage.setItem('lastOpenedFile', currFile);	
	} else {
		localStorage.removeItem('lastOpenedFile');
	}
	localStorage.setItem('window.width', mainWindow.width);
	localStorage.setItem('window.height', mainWindow.height);
	this.close(true);
});

/*
 *	Create menu
 */
mainWindow.menu = Menu.create(gui, [{
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

/*
 *	Bind keyboard shortcuts
 */
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
	if(fileHasChanged && codeMirror.getValue()) {
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
		fileSys.browse(function(resp) {
			codeMirror.setValue(resp.data);
			currFile = resp.path;
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
	fileSys.saveAs('doc.md', codeMirror.getValue(), function(resp) {
		currFile = resp.path;
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
