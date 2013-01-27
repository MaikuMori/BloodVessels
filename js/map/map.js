
function Map(scene) {
    this.mapLines = new THREE.Object3D();
    
    this.OMGLines = new THREE.Object3D();
    this.OMGLines.add(this.mapLines);
    scene.add(this.OMGLines);

}

Map.prototype.generate = function(scene) {
    
    this.firstPiece = new MapPiece();
    this.playerPiece = this.firstPiece;
    this.lastPiece = this.firstPiece;
    for(var i =0;i<40;i++) {
        this.lastPiece = new MapPiece(this.lastPiece).drawMap(scene, this);
        this.lastPiece.checkPointWithinPiece(new Point(0,0));
    }
    
    return this;
};

Map.prototype.checkPosition = function(pos) {
    
    var x = pos.x;
    var y = pos.y;
    
    var pieceBottom;
    
    var mapPiece = this.firstPiece.getNextPiece();
    this.playerPos = 0;
    //var i=0;
    while(typeof mapPiece !== 'undefined') {
        
//        console.log(this.mapLines);
        //new Point(this.mapLines.)
//        mapPiece.checkPointWithinPiece(new Point(this.mapLines.position.x,-this.mapLines.position.y));
        //console.log(i++);
        
        
        // user must be between two checkpoints to check his bounds
//        if(y > mapPiece.p1.y) {
//            pieceBottom = mapPiece;
//        }
//        else if(pieceBottom && y < mapPiece.p1.y) {
        if(mapPiece.checkPointWithinPiece(new Point(-this.mapLines.position.x,-this.mapLines.position.y))) {
            
            this.playerPiece = mapPiece;
            
//            var dy = y-pieceBottom.p1.y;
//            var dx = 0;
//            var pieceCenterX = pieceBottom.p1.x;//+(dy/Math.tan(pieceBottom.angle*Math.PI/180));
////            console.log(pieceCenterX, pieceBottom.p1.x);
//            if(x > pieceCenterX+pieceBottom.wallDistance+40) {
//                dx = -1;
//            }
//            else if(x < pieceCenterX-pieceBottom.wallDistance-40) {
//                dx = 1;
//            }
//            
//            pos.set(pos.x + dx, pos.y,pos.z);
            break;
        }
        
        
        mapPiece = mapPiece.getNextPiece();
        this.playerPos++;
    }
    
}

Map.prototype.drawMore = function(scene) {
    
    // a new piece is added only if one can be removed
    if(this.playerPos > 20) {
        this.lastPiece = new MapPiece(this.lastPiece).drawMap(scene, this);
        this.removePiece(scene);
    }
    
};

Map.prototype.removePiece = function(scene) {
    
    // @FIXME this makes only possible to make one tunnel
    // because here first child is chosen as the next tunnel
    var piece = this.firstPiece;
    var nextPiece = this.firstPiece.connected_peaces[0];
    this.firstPiece = nextPiece;

    this.mapLines.remove(piece.mapLines);
    piece.connected_peaces = null;
    this.firstPiece.previousPiece = null;
    
};

Map.prototype.addMapLines = function(mapLines) {
    this.mapLines.add(mapLines);
}
