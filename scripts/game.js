// World Parameters object
var worldParams = {  /* NB : world, perso, level and difficulty are defined in the HTML before the game */
	world: 1,  // Can be equal to 1, 2, 3 or 4 (default = 1)
	perso: 1,  // Can be equal to 1, 2, 3 or 4 (default = 1)
	score: 0,  // Score (default = 0)
	level: 100,  // Objective (default = easier)
	difficulty: 12,  // Difficulty level (default = easier)
}

// General gameplay vars
var arrowSpace = 32;  // SPACE keycode
var arrowTop = 38;  // UP ARROW keycode
var arrowBottom = 40;  // DOWN ARROW keycode
var arrowShift = 16;  // SHIFT keycode
var keyEscape = 27;  // ESCAPE keycode
var keyS = 83;  // S keycode — used for jump-start running animation
var groundRepetition;  // For background repetition
var vitesseGround = 250;  // Ground speed based on level (+ lag is adjusted automatically)
var levelLength = 10;  // Game width measured in ground blocks
var intervalGame = function () {};  // Interval initialized for ground scrolling
var intervalBackground = function () {};  // Interval initialized for background scrolling	
var compteurGeneration = {  // Used to add new ground blocks whenever conditions are true
	value: 0,
	add: function () { this.value++; },
	reset: function () { this.value = 0; },
	get: function () { return this.value; }
};

// Background scrolling vars
var bgScrollVars = {
	speed: 50,  // Speed in milliseconds
	current: 0,  // Set the default position
	direction: 'h'  // Set the direction ('h' or 'v')
}

// World selection funtion (background + ground textures)
$('.worldselect').click(function(event) {
	$('.parallax-layer').css('background','url("img/worlds/bgScene'+ worldParams.world +'.png")');
	$('.ground').css('background','url("img/grounds/ground'+ worldParams.world +'.png")');
});

// Character selection function
$('.persoselect').click(function(event) {
	$('#perso').css('background', 'url("img/perso'+ worldParams.perso +'.png")');
});

// Game starting function (which essentially includes all the game mechanics)
function gameStart() {
	$('#game').css('display','block');  // Shows the game
	$('#site').css('display','none');  // Hides the site
	$('header').append('<audio id="player" src="sounds/rof.mp3" autoplay loop>Veuillez mettre à jour votre navigateur !</audio>');  // Starts the music

	// Run animation
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

	// Repetition of Run animation 
	jQuery.fn.mouvMarcheDrt = function(){
		$(this).marcheDrt();
		$(this).everyTime(400,function(){
			$(this).marcheDrt();
		});
	};

	// Jump animation and Run resuming
	var jumping = false;
	jQuery.fn.marcheTop = function() {
		if(!jumping){
			jumping = true;
			$(this).css({backgroundPosition:'-528px 0px'}).animate({ "bottom": "+=300px" }, 700 );
  			$(this).css({backgroundPosition:'-660px 0px'}).animate({ "bottom": "-=300px" }, 950 , function () {
  				$("#perso").stopTime().mouvMarcheDrt();
  			});
  			setTimeout(land, 1301);
  			function land() {
				jumping = false;
			}
		}
	};	
	
	$(document).ready(function() {  // Start and jump-start function, also pause/resume function (broken at the moment)
		var arret = 0;
		$(document).on('keydown', function (touche) {
			var appui = touche.keyCode;
	    	if(appui === keyS) {  // When "S" is pressed
	        	if (arret == 1) {
					arret = 0;
				} else {
					$("#perso").stopTime().mouvMarcheDrt();
				}
	    	} else if(appui === arrowTop){  // When "arrowTop" is pressed
	    		if (arret == 1) {
					arret = 0;
				} else {
					$("#perso").stopTime().marcheTop();
				}
	    	}
		});
	
		(function() {  // When tab/window is not active, JS execution pauses
	    	var time = 999999999, // Game time limit, important to set it high
	        	delta = 50,
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
	        	}
	    	}, delta);
		})();
		window.onblur = function() { window.blurred = true; };
		window.onfocus = function() { window.blurred = false; };
		$('.overlay').addClass('hidden');
		$(document).ready(function() {  // Dealing with game pause/resume (WIP)
			$(document).keyup(function(touche){
		    	var appui = touche.which || touche.keyCode;
		    	if (appui == 32){  // When "SPACE" is pressed
		        	if ($('.overlay').hasClass('hidden')){
						$('.overlay').removeClass('hidden');
						clearInterval(intervalGame);
						clearInterval(intervalBackground);
					} else {
						$('.overlay').addClass('hidden');
						loop();
						bgscroll();
						intervalGame = setInterval(loop, vitesseGround);
						intervalBackground = setInterval(bgscroll, bgScrollVars.speed);
						$("#perso").stopTime().mouvMarcheDrt();
					} 
					event.stopImmediatePropagation();
		    	} 
		    })
		});

		function bgscroll(){  // Scrolls the background infinitely, using background-position property
		    bgScrollVars.current -= 1; // 1 pixel row at a time
		    $('.parallax-layer').css("backgroundPosition", (bgScrollVars.direction == 'h') ? bgScrollVars.current+"px 0" : "0 " + bgScrollVars.current+"px");  // Moves the background with backgrond-position css properties
		}

		function createGround() {  // Get screen width, divide it by block width to know how many blocks are needed to fill the screen (+2 as margin)
			levelLength = Math.ceil($(window).width() / 100) + 2;
			for (var i=0; i<levelLength; i++) {
				var translateX = i * 100; // block position (= order * block width)
				$("#grounds").append('<div class="ground" style="left: '+ translateX +'px"><img border="0" alt="animated ground" src="img/grounds/ground'+ worldParams.world +'.png" /></div>');
			};
			grounds = $('#grounds').children();  // Get #grounds children, aka each .ground
			intervalGame = setInterval(loop, vitesseGround);  // Start block movement
			intervalBackground = setInterval(bgscroll, bgScrollVars.speed);  // Start background scrolling
		};
		createGround();

		
	  	function loop() {  // Refreshing ground blocks positions
	  		grounds.each(function () {  // For each block
	  			$(this).animate({  // translate to the left
	            	left: parseInt($(this).css('left')) - 100 +"px"
	        	}, (vitesseGround-20), 'linear', function () {
	        		if ((parseInt($(this).css('left')) + 100) <= 0) {  // Once beyond the left screen border, the block is replaced on the right
	        			$(this).css('left', (parseInt($(window).width()) + 100) +"px");
	        			compteurGeneration.add();
	        		}
	        		if (compteurGeneration.get() == worldParams.difficulty) {  // When generations equals difficulty
	        			var levelLength = Math.ceil($(window).width() / 100) + 2;
	        			var i=0; i<levelLength; i++;
						var translateX = i * 120; 
	        			// A new obstacle is added to the game
						$("#obstacles").append('<div data-hitbox="true" class="obstacle" id="obsActive" style="bottom: '+ translateX +'px"><img border="0" alt="animated obstacle" src="img/obstacles/obstacle'+ worldParams.world +'.png" /></div>');
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
	});
	$("#perso").stopTime().mouvMarcheDrt();
} // END of gameStart()

var etatPerso = true;
function hitboxCheck() {
	var perso = $('#perso');
	var persoHitbox = {
		height: 200,
		width: 128,
		bottom: parseInt(perso.css('bottom')),
		left: 200,
		right: 328,
	};
	var obs = $('#obsActive');
	var obsHitbox = {
		height: 130,
		width: 72,
		bottom: 110,
		top: 240,
		right: parseInt(obs.css('right')),
		left: $(window).width() - 72 - parseInt(obs.css('right')),
	};
	if(obsHitbox.left <= persoHitbox.right && obsHitbox.right >= persoHitbox.left){
		if(persoHitbox.bottom <= obsHitbox.top) {  // Code executed in case of collision (= defeat)
			var etatPerso = false;
			window.location.href = "dead.html";
		} else {  // Code executed in case of dodge
			obs.removeAttr('id');
			worldParams.score = worldParams.score+10;
			$("#scoreCounter").text(worldParams.score +' / '+ worldParams.level);
			if (worldParams.score >= worldParams.level) {  // Victory condition and events
				window.location.href = "victoires/victoire"+ worldParams.world +".html";
			};
		}
	}
	hitTimer = setTimeout(hitboxCheck, 500);  // hitboxCheck is cycled on a 0.5s basis
}
hitboxCheck();

// Game restart function
function gameRestart() {
	location.reload();
}