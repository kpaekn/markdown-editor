var toolbar = $('#toolbar');
var codeContainer = $('#code-container');
var previewContainer = $('#preview-container');
var preview = previewContainer.find('.preview');

/**
 *	Initialize editor
 */
var aceEditor = ace.edit('ace-editor');
aceEditor.setTheme('ace/theme/twilight');
aceEditor.getSession().setMode('ace/mode/markdown');
aceEditor.getSession().setUseWrapMode(true);
aceEditor.setPrintMarginColumn(false);

var fs = new Filesys();
var fileHasChanged = false;
var currFile = localStorage.getItem('lastOpenedFile');
var gui = require('nw.gui');
var mainWindow = gui.Window.get();

/**
 *	Load last file
 */
if(currFile) {
	fs.open(currFile, function(resp) {
		if(resp.error) {
			newFile();
		} else {
			aceEditor.getSession().setValue(resp.data);
			fileHasChanged = false;	
			setTitle(currFile);
		}
	});
}

/**
 *	Restore the state from previous session
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

/**
 *	Save the state of the app on close
 */
mainWindow.on('close', function() {
	checkIfFileChanged(function() {
		mainWindow.hide();
		if(currFile) {
			localStorage.setItem('lastOpenedFile', currFile);	
		} else {
			localStorage.removeItem('lastOpenedFile');
		}
		localStorage.setItem('window.width', mainWindow.width);
		localStorage.setItem('window.height', mainWindow.height);
		mainWindow.close(true);
	});
});

/**
 *	Initialize toolbar
 */
(function() {
	// Add tooltips to toolbar buttons
	toolbar.find('button').qtip({
		position: {
			my: 'top left',
			at: 'bottom right'
		}
	});
	// click events
	toolbar.find('.new').click(newFile);
	toolbar.find('.open').click(browseFile);
	toolbar.find('.save').click(saveFile);
	toolbar.find('.saveas').click(saveFileAs);
})();

/**
 *	Enable resizing of the panes
 */
(function() {
	var win = $(window);
	var onResize = function() {
		var wWidth = win.width();
		var cWidth = codeContainer.width();
		if(cWidth < 100) {
			cWidth = 100;
		} else if(wWidth - cWidth < 100) {
			cWidth = wWidth - 100;
		}
		codeContainer.width(cWidth);
		previewContainer.width(wWidth - cWidth);
		aceEditor.resize();
	};
	codeContainer.resizable({
		handles: 'e'
	}).resize(onResize);
	win.resize(onResize);
})();

/**
 *	Editor on change
 */
(function() {
	aceEditor.getSession().on('change', function(e) {
		// Parse markdown and display in preview
		preview.html(marked(aceEditor.getSession().getValue()));
		fileHasChanged = true;
	});
})();

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
	if(fileHasChanged && aceEditor.getSession().getValue()) {
		$.popup({
			body: 'Do you want to save your changes?',
			width: 300,
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
		aceEditor.getSession().setValue('');
		currFile = null;
		fileHasChanged = false;
		setTitle('Untitled');
	});
}
function browseFile() {
	checkIfFileChanged(function() {
		fs.browse(function(resp) {
			aceEditor.getSession().setValue(resp.data);
			currFile = resp.path;
			setTitle(currFile);
		});
	});
}
function saveFile() {
	if(currFile) {
		if(fileHasChanged) {
			fs.save(currFile, aceEditor.getSession().getValue(), postSave);	
		} else {
			postSave();
		}
	} else {
		saveFileAs();	
	}
}
function saveFileAs() {
	fs.saveAs(aceEditor.getSession().getValue(), function(resp) {
		currFile = resp.path;
		postSave();
		setTitle(currFile);
	});
}
function postSave() {
	$.notify({ text: 'File saved.' });
	fileHasChanged = false;
}
function exitApp() {
	$('body').animate({ opacity: 0.2 }, 400, 'linear', function() {
		mainWindow.close();
	});
}
function setTitle(title) {
	$('title').html(title + ' - Markdown Editor');
}