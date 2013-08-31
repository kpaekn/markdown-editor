(function($) {

	var TEMPLATE = '<div class="notify"></div>',
		DEFAULT_OPTS = {
			'text': 'Default text value',
			'duration': 2000,
			'fadeDuration': 500
		},
		body = $('body');

	$.notify = function(opts) {
		opts = $.extend(DEFAULT_OPTS, opts);

		var notify = $(TEMPLATE);
		notify.text(opts.text);
		body.append(notify);

		notify.css('opacity', 0).animate({
			'opacity': 1
		}, opts.fadeDuration, 'linear', function() {
			setTimeout(function() {
				notify.animate({
					'opacity': 0
				}, opts.fadeDuration, 'linear', function() {
					notify.remove();
				});
			}, opts.duration);
		});
	};

})(jQuery);