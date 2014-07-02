
var MINI = require('minified'), _=MINI._, $=MINI.$, HTML=MINI.HTML; 

MINI.M.prototype.modal = function(o) { 

   // Default settings
   var opt = {
		width: '50%', // The box width (es. '500px')
		height: '50%', // The box height (es. '300px')
		maxWidth: '800px', // The box height (es. '300px')
		maxHeight: '600px', // The box height (es. '300px')
		content: '', // The box HTML content
		load: '' // Path to external file to load in the box
	};

	_.extend(opt, o); 


	this.on('click', init)

	function init(){
		
		// Setup
		$('body').add(HTML('<div id="d-back"></div><div id="d-modal"><div id="d-close-btn"></div><div id="d-modal-content"></div></div>'));
		$('#d-back, #d-close-btn').on('click', close);
		
		// Find maximum z-index
		var mz = 0;
		$('*').per(function(el, i) {
			var z = $(el).get('$zIndex', true);
			if(z > mz) mz = z;
		});

		var href = this.get('@href');
		
		if(href.match('http(s)?://(www.)?youtube|youtu\.be')){
			var youtubeID = getYoutubeID(href);
			opt.content = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+youtubeID+'?rel=0&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
		}else {
			opt.content = '<iframe width="100%" height="100%" src="'+href+'" frameborder="0"></iframe>';
		}
		
		$('#d-modal-content').ht('{{{content}}}', opt);

		$('#d-back,#d-modal,#d-close-btn').show();

		$('#d-back').set({
			$backgroundColor: '#000',
			$$fade: 0.75,
			$position: 'fixed',
			$width: '100%',
			$height: '100%',
			$zIndex: mz + 1,
			$top: 0,
			$left: 0,
			$cursor: 'pointer'
		});
					
		$('#d-modal').set({
			$backgroundColor: '#fff',
			$$fade: 0,
			$margin: 'auto',
			$position: 'fixed',
			$top: 0,
			$left: 0,
			$bottom: 0,
			$right: 0,
			$zIndex: mz + 2,
			$width: opt.width,
			$height: opt.height,
			$maxWidth: opt.maxWidth,
			$maxHeight: opt.maxHeight,
/*			$overflowY: 'auto',*/
		}).animate({$$fade: 1}, 300);

		$('#d-close-btn').set({
				$position:'absolute',
				$top: '-40px',
				$right:'-40px',
				$zIndex:1002,
				$cursor:'pointer'
		});
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
			
	function close(){
		$('#d-modal iframe').hide();
		$('#d-back,#d-modal,#d-close-btn').remove();
	}
	
	
}
