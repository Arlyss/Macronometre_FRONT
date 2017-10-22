
var mesures = [];
var badges = [];
var badgesAnimations;
var badgesAnimated = 0;

(function ($) {
	
	$.AnimatedBadges = function(){
		if(badgesAnimated >= badges.length){
			clearInterval(badgesAnimations);
			return;
		}
		var B = $(badges[badgesAnimated].element);
		/*if(B.hasClass('combo')){
			B.addClass('animated').delay(400).removeClass('animated');
		}else{
			B.addClass('animated');
		}*/
		console.log( badges[badgesAnimated] );
		badges[badgesAnimated].AnimateBadge_start();
		badgesAnimated++;
	}

	$.Mesure = function (m) {
		mesures.push(this);
		this.element = $(m);
		this.id = mesures.length;
		this.isOpened = false;
		this.mesureBadges = [];
		this.InitEvents();
	};

	$.Mesure.prototype = {
		InitEvents: function() {
			// "this" reference
			var that = this;
			// CLICK on TITLE
			$(this.element).find('div.title,div.icon_box').on('click',function (e) {
				$.each(mesures,function(i,v){
					if(v.id == that.id) {
						if(this.isOpened) {
							that.close();
						}else{
							that.open();
						}
					}else{
						v.close();
					}
				});
			});
			// LIST badges
			$('div#achievement_'+this.id+' div.badge').each(function(i,v){
				new $.Badge(v);
				that.mesureBadges.push(v);
			});

		},
		// method: OPEN text panel
		open: function(){
			this.isOpened = true;
			this.element.addClass('opened');
		},
		// method: CLOSE text panel
		close: function(){
			this.isOpened = false;
			this.element.removeClass('opened');
		}
	};

	/* ------------------------------------------ */

	$.Badge = function (m) {
		badges.push(this);
		this.element = $(m);
		this.InitEvents();
		this.animateTimeout;
		this.animateFrame = 0;
		this.laec_title;
		this.laec_text;
		this.laec_link;
	};

	$.Badge.prototype = {
		InitEvents: function() {
			// "this" reference
			var that = this;

			// Get Text/Link
			if( !$(this.element).hasClass('disabled') ){
				this.laec_title = $(this.element).find('div.badge_info span.info_text');
				this.laec_text = $(this.element).find('div.laec_text');
				this.laec_link = $(this.element).find('div.laec_link');
			}

			// Display TOOLTIPS
			this.element.mouseenter(function(e) {
				if( !$(this).children('div.badge_info') ){
					return false;
				}
				x = e.pageX - $(this).offset().left;
				y = e.pageY - $(this).offset().top;
				$(this).children('div.badge_info').css({'display':'block','top':y+offsetY,'left':x+offsetX});
			}).mousemove(function(e){
				x = e.pageX - $(this).offset().left;
				y = e.pageY - $(this).offset().top;
				$(this).children('div.badge_info').css({'top':y+offsetY,'left':x+offsetX});
			}).mouseleave(function(e){
				$(this).children('div.badge_info').css({'display':'none'});
			});

			// Modal View on CLICK
			this.element.on('click',function(e){
				if(that.laec_text!=undefined && that.laec_link!=undefined){
					$('div#modal_screen div.laec_title').html( that.laec_title.html() );
					$('div#modal_screen div.laec_text').html( that.laec_text.html() );
					$('div#modal_screen div.laec_link').on('click',function(){
						window.open(that.laec_link.text(), '_blank' );
					});
					$('div#modal_screen').addClass('display');
				}
			});
		},
		AnimateBadge_start: function() {
			this.animateTimeout = setInterval(this.AnimateBadge, 100, this );
		},
		AnimateBadge: function(b){
			if(b.animateFrame>=12){
				clearInterval(b.animateTimeout);
				return;
			}
			$(b.element).css('background-position', (-b.animateFrame*50)+'px 0px');
			b.animateFrame++;
		}
	};

}(jQuery));
