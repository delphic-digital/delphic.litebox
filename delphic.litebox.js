
;(function(DELPHIC, $) {

	var $body = null,
	    data = {},
	    options = {
	    	container: null,
	    	maxWidth: '85%',
	    	maxHeight: '85%',
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
		    type = $target.data("litebox-type") || "";

		_killDefaultEvent(e);

		// Cache internal data
		data = $.extend({}, {
			$window: $(window),
			$body: $("body"),
			$target: $target
		}, e.data);

		// Assemble HTML
		var html = '';
		html += '<div id="litebox" class="loading">';
		html += '<div class="litebox__container">';
		html += '<div class="litebox__loading">Loading</div>';
		html += '<div class="litebox__close"></div>';
		html += '<div class="litebox__content">';
		html += '</div></div></div>'; //__container,__content litebox

		data.$body.append(html);

		data.$bodyContainer = $(options.container);
		data.$overlay = $('#litebox-overlay');
		data.$litebox = $('#litebox');
		data.$container = data.$litebox.find(".litebox__container");
		data.$content = data.$litebox.find(".litebox__content");
		data.$close = data.$litebox.find(".litebox__close");

		_bindStyles();

		_bindEvents();

/*		if(href.match('http(s)?://(www.)?youtube|youtu\.be')){
				var youtubeID = getYoutubeID(href);
				opt.content = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeID+'?rel=0&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
			}else {
				opt.content = '<iframe width="100%" height="100%" src="'+href+'" frameborder="0"></iframe>';
			}*/

		if(type === 'image'){
			_loadImage(source);
		}else{
			_loadURL(source);
		}
	}

	function _bindStyles() {

		data.$litebox.css({
			backgroundColor: options.overlayColor,
		})

		data.$container.css({
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			padding: options.borderWidth+'px'
		})

		data.$bodyContainer.addClass('blurred')

	}

	function _bindEvents() {
		data.$body.on("click.litebox", ".litebox__close", onClose)
		data.$window.on("resize.litbox", onResize)
	}

	function _loadImage(source) {
			data.$image = $("<img />");
			data.$image.load(function() {
				var size = _getImageSize(data.$image); //console.log(size);
				data.$image.data('naturalSize', size);
				_open(data.$image);
			})
			.attr("src", source)
			.css({
				display: 'block',
				maxWidth: '100%',
				maxHeight: '100%',
				height: 'auto',
				border: 0
			})
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

	function _appendObject($object) {
		data.$content.append($object);
	}

	function _calcContainerSize(w, h) {
		var maxWindowWidth = data.$window.width()*parseInt(options.maxWidth)/100;
		var maxWindowHeight = data.$window.height()*parseInt(options.maxWidth)/100;
		var aspectRatio = w/h;

		var maxImageHeight;
		var maxImageWidth;

		if(w>h){
			//Wide
			if(w>maxWindowWidth){
				w=maxWindowWidth;
			}
			h=w/aspectRatio;

			if(h>maxWindowHeight){
				h=maxWindowHeight;
				w=h*aspectRatio;
			}

		}else{
			//Tall
			if(h>maxWindowHeight){
				h=maxWindowHeight;
			}
			w=h*aspectRatio;

			if(w>maxWindowWidth){
				w=maxWindowWidth;
				h=w/aspectRatio;
			}
		}

		return {
				newHeight: h,
				newWidth:  w
			}

	}

	function _open(elm) {
		var size = elm.data('naturalSize');
		data.imageNaturalSize = size;
		var containerSize = _calcContainerSize(size.naturalWidth,size.naturalHeight);
		data.$litebox.removeClass("loading");
		data.$container.velocity({ width: containerSize.newWidth, height: containerSize.newHeight}, 300, function(){
			_appendObject(elm);
			data.$content.velocity({ opacity: 1 }, 500);
		});

	}

	function _resize(w, h){
		var containerSize = _calcContainerSize(w,h);
		data.$container.css({ width: containerSize.newWidth, height: containerSize.newHeight});
	}

	function _killDefaultEvent(e) {
		if (e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
	}

	function onClose(e) {
		data.$litebox.remove();

		// Clean up
		data.$body.off(".litebox")
		data.$bodyContainer.removeClass('blurred')

		// reset data
		data = {};
	}

	function onResize(e){
		_resize(data.imageNaturalSize.naturalWidth, data.imageNaturalSize.naturalHeight)

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

	function _getImageSize($img) {
		var node = $img[0],
			img = new Image();

		if (typeof node.naturalHeight !== "undefined") {
			return {
				naturalHeight: node.naturalHeight,
				naturalWidth:  node.naturalWidth
			};
		} else {
			if (node.tagName.toLowerCase() === 'img') {
				img.src = node.src;
				return {
					naturalHeight: img.height,
					naturalWidth:  img.width
				};
			}
		}

		return false;
	}

	$.fn.litebox = function(method) {
		if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

} (DELPHIC = window.DELPHIC || {}, window.jQuery || window.Zepto));
