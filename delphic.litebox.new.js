;(function(DELPHIC, $) {
	"use strict";

	// http://ryanflorence.com/authoring-jquery-plugins-with-object-oriented-javascript/

	// first we set up our constructor function
	var Litebox = function($elm, config){
		this.init($elm, config);
		this.attach($elm);
	};

	// now we define the prototype

	Litebox.prototype = {

		defaults: {
			maxWidth: '90%',
	    maxHeight: '90%'
		},
		constructor: Litebox,
		root: 'body',
		targetAttr : 'href',

		contentFilters: {
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image(),
						$img = $('<img src="'+url+'" alt="" class="litebox__image" />');

					img.onload  = function() {
						$img.naturalWidth = img.width; $img.naturalHeight = img.height;
						deferred.resolve($img);
					};
					img.onerror = function() { deferred.reject($img); };
					img.src = url;
					return deferred.promise();
				}
			},
			html: {
				regex: /^\s*<[\w!][^<]*>/, /* Anything that starts with some kind of valid tag */
				process: function(html) { return $(html); }
			}
		},

		init: function($elm, config){
			this.$elm = $elm;
			this.config = $.extend({}, this.defaults, config);

			var self = this,
			    $html = $([
						'<div id="litebox" class="loading">',
							'<div class="litebox__container">',
								'<div class="litebox__loading"><div></div></div>',
								'<div class="litebox__close"></div>',
								'<div class="litebox__content"></div>',
							'</div>',
						'</div>'].join(''));

			self.$instance = $html.clone()
			return self;
		},

		attach: function(){
			var self = this;
			self.$elm.on('click.litebox', function(e){
				e.preventDefault();
				self.$target = $(this);
				self.open();
			})

			$(window).on("resize.litebox", function(e){
				self.resize();
			})
		},
		open: function(event){
			DEBUG && console.log('open');

			var self = this,
			    $content = self.getContent();

			if($content){
				self.$instance.appendTo(self.root).velocity("fadeIn", { duration: 500 })

				//Set content and show
				$.when($content).done(function($content){
					self.setContent($content);

					//TODO: _after callback, test resize for now...
					self.resize()
				});
				return self;
			}

		},

		getContent: function(){
			DEBUG && console.log('getContent');
			var self = this,
				filters = this.contentFilters,
				filter = null,
				readTargetAttr = function(name){ return self.$target && self.$target.attr(name); },
				data = readTargetAttr(self.targetAttr),
				target = data;

				console.log(self)

			$.each(filters, function() {
				filter = this;

				if(filter.regex && target.match && target.match(filter.regex)) {
					data = target;
				}
				return !data;
			});

			//Process it
			return filter.process.call(self, data);
		},

		setContent: function($content){
			DEBUG && console.log('setContent');
			var self = this;

			self.$instance.removeClass('loading')


			self.$content = $content.addClass('litebox__content');
			self.$instance.find('.litebox__content').html($content);
			self.$content = $content;
			return self;
		},

		resize: function(){
			var w = this.$content.naturalWidth,
			    h = this.$content.naturalHeight,
			    maxWindowWidth = $(window).width()*parseInt(this.config.maxWidth)/100,
			    maxWindowHeight = $(window).height()*parseInt(this.config.maxHeight)/100,
			    aspectRatio = w/h;

			if(w>h){
				//Wide
				if(w>maxWindowWidth){
					w=maxWindowWidth;
					h=w/aspectRatio;
				}

				if(h>maxWindowHeight){
					h=maxWindowHeight;
					w=h*aspectRatio;
				}

			}else{
				//Tall
				if(h>maxWindowHeight){
					h=maxWindowHeight;
					w=h*aspectRatio;
				}

				if(w>maxWindowWidth){
					w=maxWindowWidth;
					h=w/aspectRatio;
				}
			}

			this.$content.css({
				width: w,
				height: h
			})
		}

	}

	// does nothing more than extend jQuery
	$.fn.litebox = function($content, config){

		return new Litebox(this, config);
	};

}(window.DELPHIC || {}, window.jQuery));