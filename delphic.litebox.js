/* ==========================================================
 *
 * Delphic.litebox.js
 * Version: 2.0.0 (Tues, 13 Jan 2015)
 * Delphic Digital
 *
 * ========================================================== */


;(function(DELPHIC, $) {

	var $body = null,
	    data = {},
	    options = {
	    	container: null,
	    	width: '50%',
	    	height: '50%',
	    	maxWidth: '800px',
	    	maxHeight: '600px',
	    	overlayColor: '#fff',
	    	overlayOpacity: '.75',
	    	borderColor: '#fff',
	    	borderWidth: 10
	    };

	function _init(opts) {
		$.extend(options, opts || {});
		$body = $("body");
		return $(this).on("click.litebox", _build);
	}

	function _build(e) {
		var $target = $(this),
		    $content = null,
		    source = ($target[0].href) ? $target[0].href || "" : "",
		    type = $target.data("boxer-type") || "";

		_killDefaultEvent(e);

		// Cache internal data
		data = $.extend({}, {
			$window: $(window),
			$body: $("body"),
			$target: $target
		}, e.data);

		// Assemble HTML
		var html = '';
		html += '<div id="litebox-overlay"></div>';
		html += '<div id="litebox">';
		html += '<div class="litebox__close">Close (X)</div>';
		html += '<div class="litebox__content">';
		html += '</div></div>'; //__content, litebox

		data.$body.append(html);

		data.$container = $(options.container);
		data.$overlay = $('#litebox-overlay');
		data.$litebox = $('#litebox');
		data.$content = data.$litebox.find(".litebox__content");
		data.$close = data.$litebox.find(".litebox__close");

		_bindStyles();

		_bindEvents();

		/*if(href.match('http(s)?://(www.)?youtube|youtu\.be')){
				var youtubeID = getYoutubeID(href);
				opt.content = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeID+'?rel=0&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
			}else {
				opt.content = '<iframe width="100%" height="100%" src="'+href+'" frameborder="0"></iframe>';
			}*/

		_loadURL(source);

		_animate();
	}

	function _bindStyles() {

		data.$overlay.css({
			backgroundColor: options.overlayColor,
			opacity: options.overlayOpacity,
			position: 'fixed',
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
		})

		data.$litebox.css({
			backgroundColor: '#fff',
			margin: 'auto',
			position: 'fixed',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			padding: options.borderWidth,
			width: options.width,
			height: options.height,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			backgroundColor: options.borderColor
		})

		data.$content.css({
			width: '100%',
			height: '100%'
		})

		data.$close.css({
			position:'absolute',
			top: '-40px',
			right:'-40px',
			zIndex:1002,
			cursor:'pointer',
			width: 70,
			height: 30
		});
	}

	function _bindEvents() {
		data.$body.on("click.litebox", "#litebox-overlay, .litebox__close", onClose)
	}


	function _loadURL(source) {
		var $iframe = $('<iframe class="litebox__iframe" src="' + source + '" />');
		_appendObject($iframe);

		$iframe.css({
			width: '100%',
			height: '100%',
			border: 0
		})
	}

	function _animate() {
		data.$container.addClass('blurred')
	}

	function _appendObject($object) {
		data.$content.append($object);
	}


	function _killDefaultEvent(e) {
		if (e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	function onClose(e) {
		data.$overlay.remove();
		data.$litebox.remove();

		// Clean up
		data.$body.off(".litebox")
		data.$container.removeClass('blurred')

		// reset data
		data = {};
	}

	function getYoutubeID(url){
		var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		var match = url.match(regExp);
		if (match&&match[2].length==11){
			return match[2];
		}else{
			//error
		}
	}

	$.fn.litebox = function(method) {
		if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

} (DELPHIC = window.DELPHIC || {}, window.jQuery || window.Zepto));
