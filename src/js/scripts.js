var preview = $('.markdown-preview');

// markdown converter
var converter = new Markdown.Converter();

var codeMirror = CodeMirror(document.body, {
	mode: 'markdown',
	theme: 'twilight'
}).on('change', function(instance, obj) {
	preview.html(converter.makeHtml(instance.getValue()));
});