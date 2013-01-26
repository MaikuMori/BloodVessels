
function Map() {
    
}

Map.prototype.generate = function() {
    
    this.starPoint = new MapPiece();
    var previousPiece = this.starPoint;
    for(var i =0;i<30;i++) {
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