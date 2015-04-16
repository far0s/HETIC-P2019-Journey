var worldChoice = 1; // Peut être égal à 1, 2, 3 ou 4 (1 par défaut)
var persoChoice = 1; // Peut être égal à 1, 2 ou 3 (1 par défaut)

// gameStart();

// Fonction de choix du monde (textures BG + GROUND)
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

// Fonction de choix du personnage
$('.persoselect').click(function(event) {
	switch(persoChoice){
		case 1:
			$('#perso').css('background', 'url("../Journey/img/perso1.png")');
			break;
		case 2:
			$('#perso').css('background', 'url("../Journey/img/perso2.png")');
			break;
		case 3:
			$('#perso').css('background', 'url("../Journey/img/perso3.png")');
			break;
		default:
			$('#perso').css('background', 'url("../Journey/img/perso1.png")');
			break;
	}
});


// Fonction qui démarre le jeu  
function gameStart() {
	$('#game').css('display','block');
	$('#site').css('display','none');
	$('header').append('<audio id="player" src="sounds/rof.mp3" autoplay loop>Veuillez mettre à jour votre navigateur !</audio>');

	// Animation de la marche
	jQuery.fn.marcheDrt = function() {
		$(this).oneTime(100,function() {
			$(this).css({backgroundPosition:'0px 0px'});
		}).oneTime(200,function() {
			$(this).css({backgroundPosition:'-267px 0px'});
	   }).oneTime(300,function() {
			$(this).css({backgroundPosition:'-133px 0px'});
		}).oneTime(400,function() {
			$(this).css({backgroundPosition:'-399px 0px'});
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
			$(this).css({backgroundPosition:'-528px 0px'}).animate({ "bottom": "+=550px" }, 700 );
  			$(this).css({backgroundPosition:'-660px 0px'}).animate({ "bottom": "-=550px" }, 950 , function () {
  				$("#perso").stopTime().mouvMarcheDrt();
  			});
  			setTimeout(land, 1301);
		}
	};	
	function land() {
		jumping = false;
	}

	jQuery.fn.marcheBottom = function() {
		$(this).css({backgroundPosition:'-793px 0px'}).animate({ "bottom": "-=0px" }, 500 );
	  	$(this).css({backgroundPosition:'-927px 0px'}).animate({ "bottom": "+=0px" }, 500, function () {
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
		var scrollSpeed = 10;  // speed in milliseconds
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

	        		// Tous les 10 blocs
	        		
	        		if (compteurGeneration.get() == 10) {
	        			console.log(compteurGeneration.get() + "ème génération !");
	        			// Code a executer
	        			// var aleaDegree = Math.round(Math.random()*5); // Determine le délai avant qu'un obstacle soit ajouté
	        			// console.log("variation = "+ aleaDegree);
	        			var levelLength = Math.ceil($(window).width() / 100) + 2;
	        			var i=0; i<levelLength; i++;
						var translateX = i * 120; 
	        			// récupérer la position de ce bloc pour ajouter un bloc html '.obstacle'
						$("#obstacles").delay((Math.round(Math.random()*5))*1000).append('<div data-hitbox="true" class="obstacle" id="obsActive" style="bottom: '+ translateX +'px"><img border="0" alt="animated obstacle" src="img/obstacles/obstacle'+ worldChoice +'.png" /></div>');
						var n = $("#obstacles").children().length;	
						// var firstObstacle = $("#obstacles").firstChild();
						console.log("nombre d'obstacles = " + n);
	        			// donner à ce bloc le même scroll que le sol (mais pas le replacement);
	        			$('.obstacle').animate({
	        				right: parseInt($(this).css('left')) - 100 +"px"
	        			}, (vitesseGround*10), 'linear');
	        			if($('#obsActive').css('right') >$(window).width()) {
	        				$('.obstacle #obsActive').removeAttr('id');
	        			}
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


var etatPerso = true;
function hitboxCheck() {
	var perso = $('#perso');
	var persoHitbox = {
		height: 200,
		width: 128,
		posbottom: parseInt(perso.css('bottom')),
		posleft: 200,
		posright: 328,
	};
	var obs = $('#obsActive');
	var obsHitbox = {
		height: 130,
		width: 72,
		posbottom: 110,
		postop: 240,
		posright: parseInt(obs.css('right')),
		posleft: $(window).width() - 72 - parseInt(obs.css('right')),
	};
	// quand obs.left inférieur ou égal à perso.right, 
	//		vérifier si perso.bottom inférieur ou égal à obs.top
	//			si true : DEAD
	if(obsHitbox.posleft <= persoHitbox.posright){
		if(persoHitbox.posbottom <= obsHitbox.postop){
			console.log('DEAD MODAFUCKA');
			// Rajouter code de fin de jeu ici !
			var etatPerso = false;
			console.log(etatPerso);
			window.location.href = "dead.html";
		} else {
			obs.removeAttr('id');
			// Code à rajouter en cas d'évitement de l'obstacle
		}
	}
	hitTimer = setTimeout(hitboxCheck, 500);
}
hitboxCheck();


// if(etatPerso = false){
// 	$('#site').css('display', 'none');
// 	$('#game').css('display', 'none');
// 	$('#deadScreen').css('display', 'block');
	
// }


// // Fonction qui redémarre le jeu
// function gameRestart() {
// 	$('.worldselect').removeAttr('disabled');
// 	$('#worldstart').removeAttr('disabled');
// }