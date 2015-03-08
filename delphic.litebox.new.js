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
		
		instance: Litebox,

		init: function($elm, config){
			this.$elm = $elm;
			this.config = $.extend({}, this.defaults, config);
			console.log('init');

			var self = this,
			    $html = $([
						'<div id="litebox" class="loading">',
							'<div class="litebox__container">',
								'<div class="litebox__loading"><div></div><div></div><div></div><div></div><div></div></div>',
								'<div class="litebox__close"></div>',
								'<div class="litebox__content"></div>',
							'</div>',
						'</div>'].join(''));

			self.$instance = $html.clone()
			return this;
		},
		
		attach: function(){
			var lb = this;
			this.$elm.on('click.lightbox', function(e){
				e.preventDefault();
				console.log(lb);
				lb.open();
			})		
		}, 
		
		open: function(){
			console.log('open now');
		}
	}
	// does nothing more than extend jQuery
	$.fn.litebox = function($content, config){

		return new Litebox(this, config);
	};

}(window.DELPHIC || {}, window.jQuery));