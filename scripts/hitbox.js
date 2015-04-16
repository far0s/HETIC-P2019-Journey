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
			obs.removeAttr('id');
		}
	}
	window.setTimeout(hitboxCheck, 500);
}
hitboxCheck();


if(etatPerso = false){
	window.alert('DEAD');
}