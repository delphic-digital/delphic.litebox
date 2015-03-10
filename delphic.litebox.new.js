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
			contentFilters: ['image', 'html']
		},
		constructor: Litebox,
		root: 'body',
		targetAttr : 'href',

		contentFilters: {
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp)(\?\S*)?$/i,
				process: function(url)  {
					console.log(url)
					var self = this,
						deferred = $.Deferred(),
						img = new Image();
					img.onload  = function() { deferred.resolve(
						$('<img src="'+url+'" alt="" class="'+self.namespace+'-image" />')
					); };
					img.onerror = function() { deferred.reject(); };
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
								'<div class="litebox__loading"><div></div><div></div><div></div></div>',
								'<div class="litebox__close"></div>',
								'<div class="litebox__content"></div>',
							'</div>',
						'</div>'].join(''));

			self.$instance = $html.clone()
			return self;
		},

		attach: function(){
			var self = this;
			self.$elm.on('click.lightbox', function(e){
				e.preventDefault();
				self.$target = $(this);
				self.open();
			})
		},

		getContent: function(){
			DEBUG && console.log('getContent');
			var self = this,
				filters = this.contentFilters,
				filter = null,
				readTargetAttr = function(name){ return self.$target && self.$target.attr(name); },
				data = readTargetAttr(self.targetAttr),
				target = data;

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
			console.log(self.$instance);
			return self;
		},

		open: function(event){
			DEBUG && console.log('open');

			var self = this,
			    $content = self.getContent();

			    console.log($content)

			if($content){
				self.$instance.appendTo(self.root).velocity("fadeIn", { duration: 500 })

				//Set content and show
				$.when($content).done(function($content){
					//self.setContent($content);
				});
				return self;
			}

		}
	}
	// does nothing more than extend jQuery
	$.fn.litebox = function($content, config){

		return new Litebox(this, config);
	};

}(window.DELPHIC || {}, window.jQuery));