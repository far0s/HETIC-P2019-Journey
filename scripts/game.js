$(document).ready(function() {

/* liste des variables utiles */
	var posRight = false; /* Par défaut le personnage ne regarde pas à droite */
	var posLeft = true; /* Par défaut le personnage regarde à gauche */
	var posTop = false;
	var posBottom = false;
	var running = false; /* Part défaut il ne court pas */
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
	var keyR = 82; /* Keycode de la touche R */
	var keyS = 83; /* Keycode de la touche S */
	var keyM = 77; /* Keycode de la touche M */
	var keyP = 80; /* Keycode de la touche P */
	var xFrames; /* Servira de repère pour le compte des frames */
	var posX = 250; /* Position horizontale par défaut du personnage */
	var exp = new RegExp("^[0-9]+$","g"); /* Expression singulière pour le compteur de frames */
	var groundRepetition; /* Pour le décor */
	var sky, hill;
	var vitesseGround = 500; /* gestion de la vitesse du sol en fonction du niveau (+ ajuste le temps de latence automatiquement)*/
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

		// On recupere les enfants de #grounds soit chaque bloc
		grounds = $('#grounds').children();
		// On lance le defilement des blocs
		intervalGame = setInterval(loop, vitesseGround);
	};

	createGround();

	// Rafraichit la position de chaque bloc
  	function loop() {
  		// On parcours chaque bloc
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

        		console.log(compteurGeneration.get());
        		// Tous les 15 blocs
        		if (compteurGeneration.get() == 10) {
        			// Code a executer
        			compteurGeneration.reset();
        		}
        	});
  		});
    }

    // Observe si l'onglet est actif ou pas
    $.windowActive = true;
	$.isWindowActive = function () {
	    return $.windowActive;
	};
	$(window).focus(function() {
	    $.windowActive = true;
	});
	$(window).blur(function() {
	    $.windowActive = false;
	});
	// Il faut que lorsque l'onglet n'est pas actif, l'éxécution du JS s'arrête
 });