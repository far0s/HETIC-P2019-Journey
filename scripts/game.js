var worldChoice = 1; // Peut être égal à 1, 2, 3 ou 4 (1 par défaut)
// Au clic sur un bouton, le background et le sol est choisi 
$('.worldselect').click(function(event) {
	switch(worldChoice){
		case 1:
			$('.parallax-layer').css('background','url("../Journey/img/worlds/bgScene1.png")');
			$('.ground').css('background','url("../Journey/img/grounds/ground1.png")');
			break;
		case 2:
			$('.parallax-layer').css('background','url("../Journey/img/worlds/bgScene2.png")');
			$('.ground').css('background','url("../Journey/img/grounds/ground2.png")');
			break;
		case 3:
			$('.parallax-layer').css('background','url("../Journey/img/worlds/bgScene3.png")');
			$('.ground').css('background','url("../Journey/img/grounds/ground3.png")');
			break;
		case 4:
			$('.parallax-layer').css('background','url("../Journey/img/worlds/bgScene4.png")');
			$('.ground').css('background','url("../Journey/img/grounds/ground4.png")');
			break;
		default:
			$('.parallax-layer').css('background','url("../Journey/img/worlds/bgScene1.png")');
			$('.ground').css('background','url("../Journey/img/grounds/ground1.png")');
			break;
	}
});


// Fonction qui démarre le jeu  
function gameStart() {
	$('.worldselect').attr('disabled', 'true');
	$('#worldstart').attr('disabled', 'true');



	// Animation de la marche
	jQuery.fn.marcheDrt = function() {
		$(this).oneTime(100,function() {
			$(this).css({backgroundPosition:'0px 0px'});
		}).oneTime(200,function() {
			$(this).css({backgroundPosition:'-239px 0px'});
	   }).oneTime(300,function() {
			$(this).css({backgroundPosition:'-80px 0px'});
		}).oneTime(400,function() {
			$(this).css({backgroundPosition:'-160px 0px'});
		});
	};

	// Répétition de marcheDrt() 
	jQuery.fn.mouvMarcheDrt = function(){
		$(this).marcheDrt();
		$(this).everyTime(400,function(){
			$(this).marcheDrt();
		});
	};

	// Animation du saut et reprise de mouvMarcheDrt()
	var jumping = false;

	jQuery.fn.marcheTop = function() {
		if(!jumping){
			jumping = true;
			$(this).css({backgroundPosition:'-315px 0px'}).animate({ "bottom": "+=100px" }, 2000 );
  			$(this).css({backgroundPosition:'-395px 0px'}).animate({ "bottom": "-=100px" }, 1500 , function () {
  				$("#perso").stopTime().mouvMarcheDrt();
  			});
  			setTimeout(land, 3501);
		}
	};	
	function land() {
		jumping = false;
	}

	jQuery.fn.marcheBottom = function() {
		$(this).css({backgroundPosition:'-474px 0px'}).animate({ "bottom": "-=0px" }, 500 );
	  	$(this).css({backgroundPosition:'-552px 0px'}).animate({ "bottom": "+=0px" }, 500, function () {
	  		$("#perso").stopTime().mouvMarcheDrt();
	  	});
	};


	$(document).ready(function() {

		// Code qui gère la touche 'S', la touche 'ESPACE' et la touche 'Flèche BAS'
		var arret = 0;
		$(document).on('keyup', function(touche) {
			var appui = touche.keyCode;
	    	if(appui == 83) { // si le code de la touche est égal à 83 (S)
	        	if (arret == 1) {
					arret = 0;
				} else {
					$("#perso").stopTime().mouvMarcheDrt();
				}
	    	} else if(appui == 38){ // si le code de la touche est égal à 38 (ESPACE)
	    		if (arret == 1) {
					arret = 0;
				} else {
					$("#perso").stopTime().marcheTop();
				}
	    	} else if(appui == 40){ // si le code de la touche est égal à 40 (Flèche BAS)
	    		if (arret == 1) {
					arret = 0;
				} else {
					$("#perso").stopTime().marcheBottom();
				}
	    	}
		});


	/* liste des variables utiles */
		var arrowSpace = 32; /* Keycode de la touche espace */
		var arrowTop = 38; /* Keycode de la fléche du haut */
		var arrowBottom = 40; /* Keycode de la fléche du bas */
		var arrowShift = 16; /* Keycode de la touche shift */
		var keyEscape = 27; /* Keycode de la barre d'espace */
		var keyS = 83; /* Keycode de la touche S */
		var groundRepetition; /* Pour le décor */
		var vitesseGround = 400; /* gestion de la vitesse du sol en fonction du niveau (+ ajuste le temps de latence automatiquement)*/
		var levelLength = 10;
		var grounds = [];
		var intervalGame = function () {};
		var intervalBackground = function () {};	
		var compteurGeneration = {
			value: 0,
			add: function () { this.value++; },
			reset: function () { this.value = 0; },
			get: function () { return this.value; }
		};


		// Fonction du scroll du background
		var scrollSpeed = 80;  // speed in milliseconds
		var current = 0;  // set the default position
		var direction = 'h';  // set the direction ('h' or 'v')
		function bgscroll(){
		    current -= 1; // 1 pixel row at a time
		    $('.parallax-layer').css("backgroundPosition", (direction == 'h') ? current+"px 0" : "0 " + current+"px");  // move the background with backgrond-position css properties
		}

		function createGround() {
			// On divise la width de l'écran par la width des blocs pour savoir combien il faut de blocs pour remplir l'écran avec une marge de 2 blocs
			levelLength = Math.ceil($(window).width() / 100) + 2;
			for (var i=0; i<levelLength; i++) {
				var translateX = i * 100; // La position du block (le numero * sa width)
				$("#grounds").append('<div class="ground" style="left: '+ translateX +'px"><img border="0" alt="animated ground" src="img/grounds/ground'+ worldChoice +'.png" /></div>');
				// $("#perso").stopTime().mouvMarcheDrt(); // gère le run automatique | sera géré par l'écran "start"
			};

			// On recupere les enfants de #grounds soit chaque bloc .ground
			grounds = $('#grounds').children();
			// On lance le defilement des blocs
			intervalGame = setInterval(loop, vitesseGround);
			// On scroll le background
			intervalBackground = setInterval(bgscroll, scrollSpeed);
		};

		createGround();

		// Rafraichit la position de chaque bloc
	  	function loop() {
	  		// On parcourt chaque bloc
	  		grounds.each(function () {
	  			// On modifie la position de chaque bloc
	  			$(this).animate({
	            	left: parseInt($(this).css('left')) - 100 +"px"
	        	}, (vitesseGround-20), 'linear', function () {
	        		// Quand un bloc sort de l'écran on le repositionne a la fin
	        		if ((parseInt($(this).css('left')) + 100) <= 0) {
	        			$(this).css('left', (parseInt($(window).width()) + 100) +"px");
	        			compteurGeneration.add();
	        		}

	        		// Tous les 15 blocs
	        		if (compteurGeneration.get() == 15) {
	        			console.log(compteurGeneration.get());
	        			// Code a executer
	        			compteurGeneration.reset();

	        		}
	        	});
	  		});
	    }

	    // WHEN TAB/WINDOW IS NOT ACTIVE, JS EXECUTION PAUSES
		(function() {
	    	var time = 999999999, // temps de jeu à définir en ms
	        	delta = 50,
	        	tid;
	    	tid = setInterval(function() {
	        	if ( window.blurred ) { 
	        		$('.overlay').removeClass('hidden');
	        		clearInterval(intervalGame);
					clearInterval(intervalBackground);
	        		return; 
	        	}

	        	time -= delta;
	        	if ( time <= 0 ) {
	            	clearInterval(tid);
	            	console.log('no more time !'); // alerting when there is no more time
	        	}
	    	}, delta);
		})();
		window.onblur = function() { window.blurred = true; };
		window.onfocus = function() { window.blurred = false; };
		$('.overlay').addClass('hidden');
		$(document).ready(function() {
			$(document).keyup(function(touche){
		    	var appui = touche.which || touche.keyCode;
		    	if (appui == 32){
		        	if ($('.overlay').hasClass('hidden')){
						$('.overlay').removeClass('hidden');
						clearInterval(intervalGame);
						clearInterval(intervalBackground);
						$("#perso").stopTime().mouvStop();
					} else {
						$('.overlay').addClass('hidden');
						loop();
						bgscroll();
						intervalGame = setInterval(loop, vitesseGround);
						intervalBackground = setInterval(bgscroll, scrollSpeed);
						$("#perso").stopTime().mouvMarcheDrt();
					} 
					event.stopImmediatePropagation();
		    	} 
		    })
		});
	});
	$("#perso").stopTime().mouvMarcheDrt();
} // END of gameStart()


// Fonction qui redémarre le jeu
function gameRestart() {
	$('.worldselect').removeAttr('disabled');
	$('#worldstart').removeAttr('disabled');
}