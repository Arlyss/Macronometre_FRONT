
var x=0;
var y=0;
var offsetX=10;
var offsetY=12;


//  Screen Dimensions
function SW(){
	return $( window ).width();
}
function SH(){
	return $( window ).height();
}



$( document ).ready(function() {
	
	// Init MESURES
	$('div.mesure').each(function(i,m){
		new $.Mesure(m);
	});

	// Animate BADGES
	badgesAnimations = setInterval($.AnimatedBadges, 3000/badges.length );
	
	// Close MODAL views
	$('div#modal_screen div.modal_window div.modal_close').on('click',function(){
		$('div#modal_screen').removeClass('display');
	});
	
});