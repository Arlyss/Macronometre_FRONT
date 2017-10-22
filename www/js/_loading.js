(function($) {

	$.LoadSite = function() {
		// DOM elements
		this.LeMacron = $('div#loadingMacron');
		this.LeLouvre = $('div#loadingPyramide');
		this.LePupitre= $('div#loadingPupitre');
		this.LeGround = $('div#loadingGround');
		
		// Check pictures load status
		this.ImagesWaitingFor = [];
		this.ImagesLoaded = 0;
		this.ImagesToLoad = 0;
		this.ImagesLoadLoop;

		// Check fonts load status
		
		// General load loop
		var status_Images = false;
		var status_Webfonts = false;
		var LAL;

		// Load Loop
		this.LoadAssets();
	}

	$.LoadSite.prototype = {
		LoadAssets: function(){
			var that = this;
			// Start "assets check loop"
			this.ImagesGetBackgroundImages();
			// Start "webfonts check loop"
			this.waitForWebfonts(['icomoon', 'icomoon2', 'montserrat', 'robotoslab'], ['&#xe901;','&#xe901;','&#x20a7;','&#x4dc;']);
			// Run the control loop
			that.LAL = setInterval( that.LoadAssets_loop, 500, that);
		},
		LoadAssets_loop: function(t){
			var that = t;
			if(that.status_Images && that.status_Webfonts) {
				that.StartLoading();
				clearInterval(that.LAL);
			}
			
		},
		waitForWebfonts: function(fonts, chars) {
			var that = this;
			var loadedFonts = 0;
		    for(var i=0; i<fonts.length; ++i) {
		    	(function(font,char) {
		            var node = $('<span>',{
		            	html: char+'giItT1WQy@!-/#',
		            	css:{
			            	position: 	 'absolute',	top:			'-10000px',		left:		'-10000px',		fontSize:	'300px',
			            	fontFamily:  'sans-serif',  fontVariant:	'normal',		fontStyle:	'normal',		fontWeight:	'normal',	letterSpacing:	'0'
		            	}
		            });
		            $('body').append(node);

		            // Remember width without web font
		            var width = $(node).width();

		            // Apply webfont
		            $(node).css('fontFamily', font + ', sans-serif');

		            function checkFont() {
		            	
		                // Compare current width with original width
		                if(node && $(node).width() != width) {
		                    ++loadedFonts;
		                    node.remove();
		                    node = null;
		                }

		                // If all fonts have been loaded
		                if(loadedFonts >= fonts.length) {
		                    if(FontLoadInterval) {
		                        clearInterval(FontLoadInterval);
		                    }
		                    if(that.status_Webfonts!==true){
								console.log('[LOAD] All WebFonts loaded !');
			                    that.status_Webfonts=true;
			                }
		                    return true;
		                }
		            };

		            var FontLoadInterval;
		            if(!checkFont()) {
		                FontLoadInterval = setInterval(checkFont, 1000);
		            }
		        })(fonts[i],chars[i]);
		    }
		},
		ImagesGetBackgroundImages: function() {
			var that = this;
			var target = 'background-image';
		    // CSS external files
		    for (var s= document.styleSheets.length - 1; s >= 0; s--) {
		        var cssRules = document.styleSheets[s].cssRules || document.styleSheets[s].rules || []; // after "||" : IE support
		        for (var c=0; c < cssRules.length; c++) {
		        	if(cssRules[c].style!=undefined && cssRules[c].style[target] && cssRules[c].style[target].indexOf("gradient") ==-1 && cssRules[c].style[target] != 'none' ){
			        	that.ImagesWaitingFor.push( cssRules[c].style[target].replace('url("../design/','').replace('")','') );
		        	}
		        }
		    }
		    that.ImagesToLoad = that.ImagesWaitingFor.length;
			that.ImagesLoadLoop = setInterval(that.ImagesLoadCheck, 1000, that );
		},
		ImagesLoadCheck: function(LS){
			var that = LS;
			that.ImagesLoaded = 0;
			$.each(that.ImagesWaitingFor,function(i,v){
				var X = $('<img/>').attr('src', '../design/'+v).on('load', function(){
					that.ImagesLoaded++;
					that.ImagesLoadCheckResult(that);
				});
				delete X;
			});
		},
		ImagesLoadCheckResult: function(LS){
			var that = LS;
			if(that.ImagesLoaded >= that.ImagesToLoad && that.status_Images!=true){
				clearInterval(that.ImagesLoadLoop);
				console.log('[LOAD] All images loaded !');
				that.status_Images = true;
				return null;
			}
		},
		StartLoading: function(){
			var that = this;
			$(that.LeLouvre).animate({
				bottom: '21%'
			},500,function(){
				$(that.LeMacron).animate({
					bottom: '50%',
					height: '150px'
				},1000,function(){
					$(that.LeGround).after($(that.LeMacron));
					$(that.LeMacron).animate({
						bottom: '20%',
						height: '500px'
					},3000,function(){
						$(that.LeMacron).addClass('finished');
						$(that.LePupitre).addClass('finished');
						$(that.LeMacron).animate({left:'50%'},2000,function(){
							that.LoadingIsDone();
						});
					});
				});
			});
		},
		LoadingIsDone: function(){
			// Call default collection
			new $.Collection(0,1,true);
		}
	}

}(jQuery));

// DOM READY
var loadSite;
$( document ).ready(function() {
	// Init XP
	loadSite = new $.LoadSite();
});