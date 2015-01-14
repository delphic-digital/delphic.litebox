/* ==========================================================
 *
 * Delphic.modal.js
 * Version: 2.0.0 (Tues, 13 Jan 2015)
 * Delphic Digital
 *
 * ========================================================== */


;(function(DELPHIC, $) {

	var $body = null,
	    data = {},
	    options = {
	    	width: '50%',
	    	height: '50%',
	    	maxWidth: '800px',
	    	maxHeight: '600px',
	    	overlayColor: '#fff',
	    	overlayOpacity: '.75'
	    };

	function _init(opts) {
		$.extend(options, opts || {});
		$body = $("body");
		return $(this).on("click.modal", _build);
	}

	function _build(e) {
		console.log(e.data)
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
		html += '<div id="modal-overlay"></div>';
		html += '<div id="modal" class="loading animating">';
		html += '<div class="modal__close">Close (X)</div>';
		html += '<div class="modal__content">';
		html += '</div></div>'; //__content, modal

		data.$body.append(html);

		data.$overlay = $('#modal-overlay');
		data.$modal = $('#modal');
		data.$content = data.$modal.find(".modal__content");
		data.$close = data.$modal.find(".modal__close");

		_bindStyles();

		_bindEvents();

		/*if(href.match('http(s)?://(www.)?youtube|youtu\.be')){
				var youtubeID = getYoutubeID(href);
				opt.content = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeID+'?rel=0&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
			}else {
				opt.content = '<iframe width="100%" height="100%" src="'+href+'" frameborder="0"></iframe>';
			}*/

		_loadURL(source);
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

		data.$modal.css({
			backgroundColor: '#fff',
			margin: 'auto',
			position: 'fixed',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		/*	zIndex: mz + 2,*/
			width: options.width,
			height: options.height,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
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
		data.$body.on("click.modal", "#modal-overlay, .modal__close", onClose)
	}


	function _loadURL(source) {
		var $iframe = $('<iframe class="modal__iframe" src="' + source + '" />');
		_appendObject($iframe);

		$iframe.css({
			width: '100%',
			height: '100%',
			border: 0
		})
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
		data.$modal.remove();

		// Clean up
		data.$body.off(".modal")

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

	$.fn.modal = function(method) {
		if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

} (DELPHIC = window.DELPHIC || {}, window.jQuery || window.Zepto));
