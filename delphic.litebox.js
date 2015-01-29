;(function(DELPHIC, $) {
	"use strict";

	function Litebox($content, config) {
		//Check if litebox is invoked already, if not, invoke it as a constructor
		if(this instanceof Litebox) {
			this.id = Litebox.id++;
			this.setup($content, config);
			this.chainCallbacks(Litebox._callbackChain);
		} else {
			var lb = new Litebox($content, config);
			lb.open();
			return lb;
		}
	}

	//Define methods

	Litebox.prototype = {
		constructor: Litebox,
		/*** defaults ***/
		contentFilters: ['image', 'html'], /* List of content filters to use to determine the content */
		/* setup iterates over a single instance of litbox and prepares the background and binds the events */
		setup: function(target, config){
			DEBUG && console.log('setup');

			if (typeof target === 'object' && target instanceof $ === false && !config) {
				config = target;
				target = undefined;
			}

			var self = $.extend(this, config, {target: target}),
			    $html = $([
						'<div id="litebox" class="loading">',
							'<div class="litebox__container">',
								'<div class="litebox__loading">Loading</div>',
								'<div class="litebox__close"></div',
								'<div class="litebox__content"></div>',
							'</div>',
						'</div>'].join(''));

			self.$instance = $html.clone();

			return this;
		},
		getContent: function(){
			DEBUG && console.log('getContent');
			var self = this,
			    filters = this.constructor.contentFilters
			   // readTargetAttr = function(name){ return self.$currentTarget && self.$currentTarget.attr(name); },
			var data = "http://www.omgmiamiswimwear.com/wp-content/uploads/2013/05/Photo-Sep-27-10-34-12-PM.jpg";
			var target = data;
			data = null;

			var filter;

			$.each(self.contentFilters, function() {
				filter = filters[this];

				if(filter.regex && target.match && target.match(filter.regex)) {
					data = target;
				}
				return !data;
			});

			//console.log(filter)

			/* Process it */
			return filter.process.call(self, data);
		},
		setContent: function(){
			DEBUG && console.log('setContent')
		},
		open: function(event){
			DEBUG && console.log('open');

			var self = this;
			var $content = self.getContent();
			console.log($content);
		},
		close: function (){
			DEBUG && console.log('close')
		},
		chainCallbacks: function(chain) {
			for (var name in chain) {
				this[name] = $.proxy(chain[name], this, $.proxy(this[name], this));
			}
		}
	};

	$.extend(Litebox, {
		id: 0,
		/* Contains the logic to determine content */
		contentFilters: {
			image: {
				regex: /\.(png|jpg|jpeg|gif|tiff|bmp)(\?\S*)?$/i,
				process: function(url)  {
					var self = this,
						deferred = $.Deferred(),
						img = new Image();
					img.onload  = function() { deferred.resolve(
						$('<img src="'+url+'" alt="" class="litebox__image" />')
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
		}
	})

	$.litebox = Litebox;

	/*$.fn.litebox = function($content, config) {
		return Litebox.attach(this, $content, config);
	};*/

}(window.DELPHIC || {}, window.jQuery));