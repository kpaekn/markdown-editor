var Notify = (function() {

	var body = $('body');

	return {
		create: function(cfg) {
			cfg = $.extend({
				text: 'The default notice.',
				duration: 2000
			}, cfg);

			var notice = $('<div class="notify"><p>' + cfg.text + '</p></div>');
			notice.css('opacity', 0);
			notice.animate({ opacity: 1 }, 500, 'linear', function() {
				setTimeout(function() {
					notice.animate({ opacity: 0 }, 500, 'linear', function() {
						notice.remove();
					});
				}, cfg.duration)
			});

			body.append(notice);
		}
	};
})();