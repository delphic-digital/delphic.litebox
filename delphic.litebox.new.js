;(function(DELPHIC, $) {
	"use strict";

	// http://ryanflorence.com/authoring-jquery-plugins-with-object-oriented-javascript/

	// first we set up our constructor function
	var Litebox = function($content, config){
		this.options = $.extend({}, this.defaults, config);
		this.setup($content, config);
	};

	// now we define the prototype

	Litebox.prototype = {

		defaults: {},

		setup: function(element){
			console.log('setup')
			//this.options.onChange.apply(this, [isEqual, this.elements]);
		},

		attach: function(){
			var self = this;
			this.elements.each(function(index, element){
				/*jQuery(element).bind({
					'change.Disabler': function(){ self.test(element); },
					'keyup.Disabler': function(){ self.test(element); }
				});*/
			});
		}
	};

	// does nothing more than extend jQuery
	$.fn.litebox = function($content, config){
		new Litebox($content, config)
		return this;
	};

}(window.DELPHIC || {}, window.jQuery));