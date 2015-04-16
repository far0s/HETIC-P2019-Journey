var overlap = (function () {
    function getPositions( elem ) {
        var postop, postleft, width, height;
        postop = parseInt($( elem ).css('top'));
        posleft = parseInt($( elem ).css('left'));
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ posleft, posleft + width ], [ postop, postop + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();



function overlapCheck() {
	$('body').each(function(){
		var perso = $('#perso')[0];
		var obstacle = $('.obstacle')[0];    
		if (overlap(obstacle, perso)){
		    console.log('overlapping !');
		};
		//console.log('overlapping !'); // le timer marche bien !
	window.setTimeout(overlapCheck, 100);
    })
};
overlapCheck();