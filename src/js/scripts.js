var preview = $('.markdown-preview');

// markdown converter
var converter = new Markdown.Converter();

var codeMirror = CodeMirror(document.body, {
	mode: 'markdown',
	theme: 'twilight'
}).on('change', function(instance, obj) {
	preview.html(converter.makeHtml(instance.getValue()));
});

var fileBrowser = new FileBrowser();

var gui = require('nw.gui');
var menu = new gui.Menu({
	type: 'menubar'
});

var fileMenuItem = new gui.MenuItem({
	label: 'File'
});
fileMenuItem.submenu = new gui.Menu();
fileMenuItem.submenu.append(new gui.MenuItem({ label: 'New' }));
fileMenuItem.submenu.append(new gui.MenuItem({ label: 'Open' }));
fileMenuItem.submenu.append(new gui.MenuItem({ label: 'Save' }));
fileMenuItem.submenu.append(new gui.MenuItem({ label: 'Save as...' }));
fileMenuItem.submenu.append(new gui.MenuItem({ type: 'separator' }));
fileMenuItem.submenu.append(new gui.MenuItem({ label: 'Close' }));

menu.append(fileMenuItem);


gui.Window.get().menu = menu;