$(document).ready(function() {

/* liste des variables utiles */
	var posRight = false; /* Par défaut le personnage ne regarde pas à droite */
	var posLeft = true; /* Par défaut le personnage regarde à gauche */
	var posTop = false;
	var posBottom = false;
	var running = false; /* Par défaut il ne court pas */
	var runRight = false;
	var runLeft = false;
	var spriteX; /* Sert à la position du sprite */
	var spriteY; /* Sert à la position du sprite */
	var animBack = false; /* Sert à la position du sprite */
	var animStop = false; /* Sert à la position du sprite */
	var animWin = false; /* Sert à la position du sprite */
	var counter = 0; /* Un compteur de frame */
	var counterAnim = 0; /* Un compteur de position */
	var counterScore = 0; /* Un compteur de score */
	var counterTime = 0; /* Un compteur de temps */
	var counterLevel = 0; /* Un compteur de niveau */
	var arrowLeft = 37; /* Keycode de la flèche gauche */
	var arrowRight = 39; /* Keycode de la flèche droite */
	var arrowSpace = 32; /* Keycode de la touche espace */
	var arrowTop = 38; /* Keycode de la fléche du haut */
	var arrowBottom = 40; /* Keycode de la fléche du bas */
	var arrowShift = 16; /* Keycode de la touche shift */
	var spaceBar = 32; /* Keycode de la barre d'espace */
	var keyR = 82; /* Keycode de la touche R */
	var keyS = 83; /* Keycode de la touche S */
	var keyM = 77; /* Keycode de la touche M */
	var keyP = 80; /* Keycode de la touche P */
	var xFrames; /* Servira de repère pour le compte des frames */
	var posX = 250; /* Position horizontale par défaut du personnage */
	var exp = new RegExp("^[0-9]+$","g"); /* Expression singulière pour le compteur de frames */
	var groundRepetition; /* Pour le décor */
	var sky, hill;
	var vitesseGround = 400; /* gestion de la vitesse du sol en fonction du niveau (+ ajuste le temps de latence automatiquement)*/
	var levelLength = 10;
	var grounds = [];
	var intervalGame = function () {};
	var compteurGeneration = {
		value: 0,
		add: function () { this.value++; },
		reset: function () { this.value = 0; },
		get: function () { return this.value; }
	};

	function createGround() {
		// On divise la taille de l'écran par la width des blocs pour savoir combien il en faut pour le remplir
		// avec une marche de 2 blocs
		levelLength = Math.ceil($(window).width() / 92) + 2;

		for (var i=0; i<levelLength; i++) {
			var translateX = i * 92; // La position du block (le numero * sa width)
			$("#grounds").append( '<div class="ground" style="left: '+ translateX +'px"><img border="0" alt="animated ground" src="img/ground.png" /></div>' );
		};

		// On recupere les enfants de #grounds soit chaque bloc .ground
		grounds = $('#grounds').children();
		// On lance le defilement des blocs
		intervalGame = setInterval(loop, vitesseGround);
	};

	createGround();

	// Rafraichit la position de chaque bloc
  	function loop() {
  		// On parcourt chaque bloc
  		grounds.each(function () {
  			// On modifie la position de chaque bloc
  			$(this).animate({
            	left: parseInt($(this).css('left')) - 92 +"px"
        	}, (vitesseGround-20), 'linear', function () {
        		// Quand un bloc sort de l'écran on le repositionne a la fin
        		if ((parseInt($(this).css('left')) + 92) <= 0) {
        			$(this).css('left', (parseInt($(window).width()) + 92) +"px");
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
        	delta = 100,
        	tid;
    	tid = setInterval(function() {
        	if ( window.blurred ) { return; }    
        	time -= delta;
        	if ( time <= 0 ) {
            	clearInterval(tid);
            	console.log('no more time !'); // alerting when there is no more time
        	}
    	}, delta);
	})();
	window.onblur = function() { window.blurred = true; };
	window.onfocus = function() { window.blurred = false; };
	});



// BACKGROUND SCROLLER FUNCTION //

var scrollSpeed = 80;  // speed in milliseconds
var current = 0;  // set the default position
var direction = 'h';  // set the direction ('h' or 'v')
function bgscroll(){
    current -= 1; // 1 pixel row at a time
    $('.parallax-layer').css("backgroundPosition", (direction == 'h') ? current+"px 0" : "0 " + current+"px");  // move the background with backgrond-position css properties
}
setInterval("bgscroll()", scrollSpeed);	 //Calls the scrolling function repeatedly