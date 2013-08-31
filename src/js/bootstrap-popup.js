(function($) {

	var TEMPLATE = ['<div class="bootstrap"><div class="panel panel-default">',
					'<div class="panel-body"></div>',
					'<div class="panel-footer"></div></div>'].join(''),
		BUTTON_TEMPLATE = '<a class="btn" href="#"></a> ',
		DEFAULT_OPTS = {
			body: null,
			width: 300,
			buttons: [{
				label: 'Default'
			}]
		},
		body = $('body'),
		backdrop = $('<div class="backdrop"></div>').css({
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 10,
			backgroundColor: '#000',
			opacity: .5
		}),
		active = false;

	$.popup = function(opts) {
		if(active) return;
		opts = $.extend(DEFAULT_OPTS, opts);

		var popup = $(TEMPLATE);
		popup.bd = popup.find('.panel-body');
		popup.ft = popup.find('.panel-footer');

		if(opts.body) {
			popup.bd.text(opts.body);	
		}

		if($.isArray(opts.buttons)) {
			for(var i = 0; i < opts.buttons.length; i++) {
				var btnOpts = opts.buttons[i];
				if(btnOpts.label) {
					var btn = $(BUTTON_TEMPLATE).css('margin-right', '.5em');
					btn.text(btnOpts.label);
					btn.data('callback', btnOpts.click);
					if(btnOpts.style) {
						btn.addClass('btn-' + btnOpts.style);
					} else {
						btn.addClass('btn-default');
					}
					popup.ft.append(btn);
				}
			}
			popup.ft.find('.btn').click(function(e) {
				e.preventDefault();
				var callback = $(e.currentTarget).data('callback');
				if(typeof(callback) !== 'function' || callback() !== false) {
					popup.remove();
					backdrop.remove();
					active = false;
				}
			});
		}

		body.append(backdrop, popup);
		popup.css({
			position: 'fixed',
			top: '50%',
			left: '50%',
			zIndex: 15,
			width: opts.width,
			marginLeft: -(opts.width / 2),
			marginTop: -(popup.outerHeight() / 2)
		});

		active = true;
	};

})(jQuery);