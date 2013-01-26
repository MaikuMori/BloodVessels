
function Map() {
    
}

Map.prototype.generate = function() {
    
    this.starPoint = new MapPiece();
    var previousPiece = this.starPoint;
    for(var i =0;i<100;i++) {
        previousPiece = new MapPiece(previousPiece);
    }
    
    return this;
};

Map.prototype.addToScene = function(scene) {
    
    var centerLine = new THREE.Geometry();
    var topLine = new THREE.Geometry();
    var leftLine = new THREE.Geometry();
    
    var mapPiece = this.starPoint.getNextPiece();
    while(typeof mapPiece !== 'undefined') {
       
        // center line
        var Point = new THREE.Vector3(mapPiece.p1.x, mapPiece.p1.y, 0);
        centerLine.vertices.push(Point);
        
        // top line
        var topPoint = mapPiece.getBorderPointRight();
        Point = new THREE.Vector3(topPoint.x, topPoint.y, 0);
        topLine.vertices.push(Point);
        
        // Left line
        var leftPoint = mapPiece.getBorderPointLeft();
        Point = new THREE.Vector3(leftPoint.x, leftPoint.y, 0);
        leftLine.vertices.push(Point);
        
        mapPiece = mapPiece.getNextPiece();
    }

    var centerLineThree = new THREE.Line(centerLine, new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 1 }));
    scene.add(centerLineThree);
    
    var topLineThree = new THREE.Line(topLine, new THREE.LineBasicMaterial({ color: 0xcc00ff, linewidth: 1 }));
    scene.add(topLineThree);
    
    var leftLineThree = new THREE.Line(leftLine, new THREE.LineBasicMaterial({ color: 0x00ffcc, linewidth: 1 }));
    scene.add(leftLineThree);
    
    return this;
}

Map.prototype.checkPosition = function(pos) {
    
    var x = pos.x;
    var y = pos.y;
    
    var pieceBottom;
    
    var mapPiece = this.starPoint.getNextPiece();
    while(typeof mapPiece !== 'undefined') {
        
        // user must be between two checkpoints to check his bounds
        if(y > mapPiece.p1.y) {
            pieceBottom = mapPiece;
        }
        else if(pieceBottom && y < mapPiece.p1.y) {
            
            var dy = y-pieceBottom.p1.y;
            var dx = 0;
            var pieceCenterX = pieceBottom.p1.x;//+(dy/Math.tan(pieceBottom.angle*Math.PI/180));
//            console.log(pieceCenterX, pieceBottom.p1.x);
            if(x > pieceCenterX+pieceBottom.wallDistance+40) {
                dx = -1;
            }
            else if(x < pieceCenterX-pieceBottom.wallDistance-40) {
                dx = 1;
            }
            
            pos.set(pos.x + dx, pos.y,pos.z);
            break;
        }
        
        
        mapPiece = mapPiece.getNextPiece();
    }
    
}