// DOM READY
$( document ).ready(function() {
	
	// Init XP
	xp = new $.XP();

	/* === EVENTS === */

	// Close MODAL views
	$('div#modal_screen, div#modal_screen div.modal_window div.modal_close').on('click',function(e){
		if( $(e.target).attr('id')=='modal_screen' || $(e.target).attr('class')=='modal_close'){
			$('body').css('overflow','visible');
			//scrollDisabled=false;
			$('html,body,div#modal_screen').disablescroll("undo");
			$('div#modal_screen').removeClass('display');
		}
	});

	// Display UserMenu
	$('div#userMenuButton').on('click',function(e){
		$('div#userMenu').toggleClass('display');
		$('div#userMenuButton').toggleClass('ico_menuA');
		$('div#userMenuButton').toggleClass('ico_menuB');
	});

	// Select a Scheme
	$('div#Schemes div.scheme').on('click',function(e){
		$('div#userMenu').toggleClass('display');
		$('div#userMenuButton').toggleClass('ico_menuA');
		$('div#userMenuButton').toggleClass('ico_menuB');
		new $.Collection( $(e.target).attr('rel'), 1 );
	});

	/*$('body').on('scroll touchmove mousewheel', function(e){
		if( scrollDisabled ){
			e.preventDefault();
			//e.stopPropagation();
			return false;
		}
	});*/
	
});