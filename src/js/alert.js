var Alert = (function() {

	var body = $('body');
	var backdrop = $('<div class="alert-backdrop"><div>');

	return {
		create: function(cfg, callback) {
			cfg = $.extend({
				text: 'Alert!',
				buttons: []
			}, cfg);

			var alert = $('<div class="alert"><p>' + cfg.text + '</p><div class="btn-group"></div></div>');
			alert.btnGroup = alert.find('.btn-group');
			for(var i = 0; i < cfg.buttons.length; i++) {
				var btn = $('<button class="btn"></button>');
				btn.html(cfg.buttons[i].label);
				btn.click(function() {
					alert.remove();
					backdrop.remove();
				});
				if(typeof(cfg.buttons[i].click) == 'function') {
					btn.click(cfg.buttons[i].click);
				}
				alert.btnGroup.append(btn)
			}

			body.append(backdrop);
			body.append(alert);
			alert.css({
				'position': 'absolute',
				'margin-left': -(alert.outerWidth() / 2),
				'margin-top': -(alert.outerHeight() / 2)
			});
		}
	};
})();