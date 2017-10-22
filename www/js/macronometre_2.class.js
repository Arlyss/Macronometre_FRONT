
var offsetX = 10;
var offsetY = 12;
var mesures = [];
var mesureClicked = [];
var badgeClicked = [];
var scrollDisabled = false;
var comboWidth = 293;
var comboHeight = 157;
var xp;

//  Screen Dimensions
function SW(){	return $( window ).width();	}
function SH(){	return $( window ).height();}


// XP
(function($) {

	$.badgesValidatedCounted = 0;

	$.XP = function() {
		this.XPbar 			 = $('div#XP_bar');
		this.XPline 		 = $('div#XP_line');
		this.lastPercent 	 = 0;
		this.lastWidth 		 = 0;
		this.badgesAmount 	 = 0;
		this.validatedBadges = [];
		this.GetValidatedBadges();
	};

	$.XP.prototype = {
		PreUp: function(){
			this.lastPercent  = (100/this.badgesAmount) * this.validatedBadges.length;
			this.lastWidth 	  = this.XPbar.width()/100 * this.lastPercent;
			this.XPline.css('width', this.lastPercent+'%');
			this.UpComplete(this.lastWidth,true);
		},
		Up: function() {
			$.badgesValidatedCounted++;
			this.lastPercent = (100/this.badgesAmount) * $.badgesValidatedCounted;
			this.lastWidth   = this.XPbar.width()/100 * this.lastPercent;
			this.XPline.animate({
				width: this.lastPercent+'%'
			},200,this.UpComplete(this.lastWidth));
		},
		UpComplete: function(XPlineWidth,preup=false){
			var that = this;
			$('div#XP_bar div.cursor.waypoint:not(passed)').each(function(i,v){
				var Wpx = parseInt( $(v).css('left').replace('px','') );
				if( Wpx <= XPlineWidth ){
					that.DisplayWaypointPass(v,preup);
				}else{
					return false;
				}
			});
		},
		StoreValidatedBadge: function(justValidatedBadges){
			// Store in user SESSION
			if(justValidatedBadges.length>0){
				var badges = [];
				$.each(justValidatedBadges,function(i,v){
					badges.push( parseInt( $(v.element).attr('rel') ) );
				});
				$.ajax({
					method: 	'POST',
					dataType: 	'json',
					url: 		'./ajax/content.ajax.php',
					data:{
						action: 'IncrementValidatedBadgesAmount',
						add:    badges,
						sql: 	true
					},
					beforeSend: function(){}
				}).done(function(res){
					if(res.success){
						$.each(justValidatedBadges,function(i,validatedBadge){
							if( $.inArray(validatedBadge.ID,badgeClicked)==-1 )
								badgeClicked.push( validatedBadge.ID );
						});
					} else {
						console.log(res.message);
					}
				});
			}
		},
		GetValidatedBadges: function(){
			var that = this;
			$.ajax({
				method: 	'POST',
				dataType: 	'json',
				url: 		'./ajax/content.ajax.php',
				data:{
					action: 'GetValidatedBadges',
					sql: 	true
				},
				beforeSend: function(){}
			}).done(function(res){
				if(res.success){
					that.badgesAmount = res.amount;
					that.validatedBadges = res.validatedBadges;
					$.badgesValidatedCounted = res.validatedBadges.length;
					$.each(res.validatedBadges, function(i,v){
						badgeClicked.push(parseInt(v));
					});
					that.PreUp();
				} else {
					console.log(res.message);
				}
			});
		},
		DisplayWaypointPass: function(waypoint,preup){
			$(waypoint).addClass('passed');
		},
		resetSession: function(){
			$.ajax({
				method: 	'POST',
				dataType: 	'json',
				url: 		'./ajax/content.ajax.php',
				data:{
					action: 'ResetSession',
					sql: 	true
				},
				beforeSend: function(){}
			}).done(function(res){
				if(res.success){
					alert('session resetted !');
					window.open('index.php','_top');
				} else {
					alert('error on session reset');
				}
			});
		}
	};

}(jQuery));





// ANIMATIONS
(function($){

	$.Animation = function(_target,_frameSize,_stopAtFrame,_speed,_onEnd='') {
		this.Target;
		if(_target.jquery){
			this.Target=_target;
		}else{
			this.Target=_target.element;
		}
		this.FrameSize = _frameSize;
		this.FrameStop = _stopAtFrame;
		this.Speed = _speed;
		this.OnEnd = _onEnd;
		this.Frame = 0;
		this.loop = null;
		this.Start();
	};

	$.Animation.prototype = {
		Start: function() {
			this.loop = setInterval(this.Animate, this.Speed, this );
		},
		Animate: function(A){
			if(A.Frame>=A.FrameStop){
				switch(A.OnEnd){
					case'delete':
						A.Target.remove();
						break;
					case'incrementXP':
						xp.Up();
						break;
					default:
						break;
				}
				clearInterval(A.loop);
				return;
			}
			$(A.Target).css('background-position', (-A.Frame*A.FrameSize)+'px 0px');
			A.Frame++;
		}
	};

}(jQuery));






(function($) {

	$.Collection = function(scheme,page,isFirst=false) {
		this.CollectionContainer = $('div#mesures');
		this.CallCollection(scheme,page,isFirst);
	};

	$.Collection.prototype = {
		CallCollection: function(scheme,page,isFirst){
			var that = this;
			$.ajax({
				method: 	'POST',
				dataType: 	'json',
				url: 		'./ajax/content.ajax.php',
				data:{
					action: 'CallCollection',
					sql: 	true,
					scheme: scheme,
					page: page
				},
				beforeSend: function(){
					that.CollectionContainer.empty();
					mesures = [];
				}
			}).done(function(res){
				
				if(res.success){

					$.each(res.mesures, function(i,M){
						
						var DIV_mesure = $('<div/>', {
								id:'mesure_'+M.MES_ID,
								class: 'mesure '+(M.VALIDATED?'validated':'waiting')
							});
						
							var DIV_iconBox = $('<div/>', {class:'icon_box'} );
							DIV_mesure.append(DIV_iconBox);
							DIV_iconBox.append( $('<div/>', {class:'rotateValidation'}) );
							DIV_iconBox.append( $('<div/>', {class:'icon ico_'+M.T_TYPE_CODE}) );
							DIV_mesure.append( $('<div/>', {class:'title',html:M.MT_NAME}) );
							var DIV_details = $('<div/>', {class:'details'} );
							DIV_mesure.append(DIV_details);
								var DIV_achievements = $('<div/>', {id:'achievement_'+M.MES_ID, class:'achievements'} );
								DIV_details.append(DIV_achievements);

									var mBadges = [];

									$.each(M.BADGES, function(j,B){
										var DIV_badge = $('<div/>', {
											id:    'badge_'+M.MES_ID+'_'+B.B_ID,
											rel:   B.B_ID,
											class: 'badge '+(B.B_STATUS==1?'validated':'waiting')+' '+
													(B.BR_LINK!=''||B.BR_TEXT!=''?'':'disabled')
										});
										if( $.inArray( parseInt(B.B_ID), badgeClicked)>=0 ){
											DIV_badge.addClass('alreadyValidated');
										}
										DIV_achievements.append(DIV_badge);
										DIV_badge.append( $('<div/>', {class:'info_date',html:B.BR_DATE}) );
										DIV_badge.append( $('<div/>', {class:'info_text',html:B.BR_TITLE}) );
										DIV_badge.append( $('<div/>', {class:'laec_title',html:B.BR_TITLE}) );
										DIV_badge.append( $('<div/>', {class:'laec_text',html:B.BR_TEXT}) );
										DIV_badge.append( $('<div/>', {class:'laec_link',html:B.BR_LINK}) );

										$.data(DIV_badge, 'B_ID' ,B.B_ID);
										mBadges.push(DIV_badge);
									});

								var DIV_detailsQuoteA = $('<div/>', {class:'details_quoteA'} );
								DIV_details.append(DIV_detailsQuoteA);
								var DIV_detailsQuoteB = $('<div/>', {class:'details_quoteB'} );
								DIV_detailsQuoteA.append(DIV_detailsQuoteB);
								DIV_detailsQuoteB.append( $('<div/>', {class:'details_text',html:M.MT_TEXT}) );

						that.CollectionContainer.append(DIV_mesure);

						setTimeout(function(){
							var MES = new $.Mesure( DIV_mesure[0], M.MES_ID );
							$.each(mBadges, function(i,v){
								var BDG = new $.Badge( v );
								MES.badges.push(BDG);
							});
							if(mBadges.length>1){
								MES.hasCombo=true;
							}
							// Si premier chargement de collection -> masquer le loading
							if(isFirst==true){
								$('div#loadingAnim').css('display','none');
								$('div#loadingPanel').animate({
									bottom: '-100%'
								},500);
							}
						},500);
					});

				} else {
					that.CollectionContainer.text(res.message);
				}
			});
		}
	};

}(jQuery));






(function ($) {

	$.Mesure = function (m, MID) {
		mesures.push(this);
		this.mesuresID = mesures.length-1;
		this.element = m;
		this.id = MID;// = $.data(m, 'M_ID');
		this.isOpened = false;
		this.badges = [];
		this.badgesListStartAnimLoop;
		this.badgesAnimated = 0;
		this.hasCombo = false;
		// letsgo
		this.InitEvents();
	};

	$.Mesure.prototype = {
		InitEvents: function() {
			// "this" reference
			var that = this;
			// CLICK on mesure TITLE-&-ICON
			$(that.element).find('div.title,div.icon_box').on('click',function (e) {
				/*if(!that.isOpened){
					window.scrollTo(0, $(e.target).offset().top + 15);
				}*/
				$.each(mesures,function(i,m){
					if(m.id == that.id) {
						if(m.isOpened) {
							m.close();
						}else{
							m.open();
							m.badgesAnimated = 0;
							m.badgesListStartAnimLoop = setInterval(this.badgesListStartAnim, 750, this.mesuresID);//750
						}
					}else{
						m.close();
					}
				});
			});

		},
		// method: OPEN text panel
		open: function(){
			this.isOpened = true;
			$(this.element).addClass('opened');
		},
		// method: CLOSE text panel
		close: function(){
			this.isOpened = false;
			$(this.element).removeClass('opened');
		},
		badgesListStartAnim: function(mesuresID){
			var laMesure = mesures[mesuresID];
			// Pour chaque badge déja vu (OU non validé dans le BO), on augmente l'index du badge à traiter
			// jusqu'à trouver un badge non validé
			var skipped=0;
			$.each(laMesure.badges, function(i,badge){
				if( $.inArray(badge.ID,badgeClicked)>=0 || ( laMesure.badgesAnimated<laMesure.badges.length && !laMesure.badges[laMesure.badgesAnimated].validated )){
					laMesure.badgesAnimated++;
					skipped++;
				}else{
					return;
				}
			});

			// Si on a tout skippé, on n'affiche pas le COMBO
			if(skipped>=laMesure.badges.length){
				clearInterval(laMesure.badgesListStartAnimLoop);
				return;
			}

			// Si on es arrivé au bout de la liste... [combo + ClearInterval]
			if(laMesure.badgesAnimated >= laMesure.badges.length){
				// Stockage dans le profil
				xp.StoreValidatedBadge(laMesure.badges);
				// Si la mesure a un combo à afficher.. COMBO
				if(laMesure.hasCombo){
					var achiev = $(laMesure.element).find('div.achievements');
					var absolutePosition_Y = achiev.offset().top + achiev.height()/2;
					var absolutePosition_X = achiev.offset().left + achiev.width()/2;
					var comboName = 'combo_'+laMesure.id;
					var newCombo = $('<div/>',{id:comboName,class:'combo'}).css({left:absolutePosition_X+'px',top:absolutePosition_Y+'px'});
					$('body').append(newCombo);
					new $.Animation( $('div#'+comboName) ,150,25,40,'delete');
				}
				// ClearInterval
				clearInterval(laMesure.badgesListStartAnimLoop);
				return;
			}

			// On anime le badge
			var badgeSize = $(laMesure.badges[laMesure.badgesAnimated].element).width();
			new $.Animation(laMesure.badges[laMesure.badgesAnimated],badgeSize,12,25,'incrementXP');
			laMesure.badgesAnimated++;
		}
	};

	/* ------------------------------------------ */

	$.Badge = function (m) {
		this.element = m;
		this.ID = parseInt($.data( m, 'B_ID' ));
		this.validated = false;
		this.info_date;
		this.info_text;
		this.laec_title;
		this.laec_text;
		this.laec_link;
		this.InitEvents();
	};

	$.Badge.prototype = {
		InitEvents: function() {
			
			var that = this;

			// Get Badge status
			if( $(this.element).hasClass('validated') ){
				this.validated = true;
			}

			// Get Text/Link
			this.info_date =  $(this.element).find('div.info_date');
			this.info_text =  $(this.element).find('div.info_text');
			if( !$(this.element).hasClass('disabled') ){
				this.laec_title = $(this.element).find('div.laec_title');
				this.laec_text =  $(this.element).find('div.laec_text');
				this.laec_link =  $(this.element).find('div.laec_link');
			}

			// Display TOOLTIPS
			if( SW()>768 ){
				$(this.element).mouseenter(function(e) {
					if( that.info_text==undefined ){
						return false;
					}
					$('div#badge_info span.info_date').text(that.info_date.text());
					$('div#badge_info span.info_text').text(that.info_text.text());
					$('div#badge_info').css({'display':'block','top':e.pageY+offsetY,'left':e.pageX+offsetX});
				}).mousemove(function(e){
					$('div#badge_info').css({'top':e.pageY+offsetY,'left':e.pageX+offsetX});
				}).mouseleave(function(e){
					$('div#badge_info').css({'display':'none'});
				});
			}

			// Modal View on CLICK
			$(this.element).on('click',function(e){
				if(that.laec_text!=undefined && that.laec_link!=undefined){
					$('body').css('overflow','hidden');
					//scrollDisabled=true;
					$('html,body,div#modal_screen').disablescroll();
					$('div#modal_screen div.laec_title').html( that.laec_title.html() );
					$('div#modal_screen div.laec_text').html( that.laec_text.html() );
					$('div#modal_screen div.laec_link').on('click',function(){
						window.open(that.laec_link.text(), '_blank' );
					});
					$('div#modal_screen').addClass('display');
				}
			});
		}
	};

}(jQuery));






(function(e){"use strict";function r(t,n){this.opts=e.extend({handleKeys:!0,scrollEventKeys:[32,33,34,35,36,37,38,39,40]},n);this.$container=t;this.$document=e(document);this.lockToScrollPos=[0,0];this.disable()}var t,n;n=r.prototype;n.disable=function(){var e=this;e.lockToScrollPos=[e.$container.scrollLeft(),e.$container.scrollTop()];e.$container.on("mousewheel.disablescroll DOMMouseScroll.disablescroll touchmove.disablescroll",e._handleWheel);e.$container.on("scroll.disablescroll",function(){e._handleScrollbar.call(e)});e.opts.handleKeys&&e.$document.on("keydown.disablescroll",function(t){e._handleKeydown.call(e,t)})};n.undo=function(){var e=this;e.$container.off(".disablescroll");e.opts.handleKeys&&e.$document.off(".disablescroll")};n._handleWheel=function(e){e.preventDefault()};n._handleScrollbar=function(){this.$container.scrollLeft(this.lockToScrollPos[0]);this.$container.scrollTop(this.lockToScrollPos[1])};n._handleKeydown=function(e){for(var t=0;t<this.opts.scrollEventKeys.length;t++)if(e.keyCode===this.opts.scrollEventKeys[t]){e.preventDefault();return}};e.fn.disablescroll=function(e){!t&&(typeof e=="object"||!e)?t=new r(this,e):t&&t[e]&&t[e].call(t)};window.UserScrollDisabler=r})(jQuery);