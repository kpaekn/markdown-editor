var createMenu = function(gui, items, type) {
	if(!$.isArray(items)) return null;

	var guiMenu, i, guiItem;
	
	if(type == 'menubar')
		guiMenu = new gui.Menu({ type: type });
	else
		guiMenu = new gui.Menu();

	for(i = 0; i < items.length; i++) {
		guiItem = createMenuItem(gui, items[i]);
		if(guiItem)
			guiMenu.append(guiItem);
	}
	return guiMenu;
};

var createMenuItem = function(gui, item) {
	var guiItem;
	if(item.label) {
		guiItem = new gui.MenuItem({
			label: item.label
		});
		if($.isArray(item.submenu)) {
			guiMenu = createMenu(gui, item.submenu);
			if(guiMenu)
				guiItem.submenu = guiMenu;
		} else if(typeof(item.click) == 'function') {
			guiItem.click = item.click;
		}
		return guiItem;
	} else if(item.type == 'separator') {
		guiItem = new gui.MenuItem({ type: 'separator' });
		return guiItem;
	}
	return null;
};