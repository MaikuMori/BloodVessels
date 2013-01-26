
function Map() {
    
}

Map.prototype.generate = function() {
    
    this.starPoint = new MapPiece();
    var previousPiece = this.starPoint;
    for(var i =0;i<10;i++) {
        previousPiece = new MapPiece(previousPiece);
    }
    
    return this;
};

Map.prototype.addToScene = function(scene) {
    
    var centerLine = new THREE.Geometry();
    var topLine = new THREE.Geometry();
    
    var mapPiece = this.starPoint;
    while(typeof mapPiece !== 'undefined') {
        var Point = new THREE.Vector3(mapPiece.p1.x, mapPiece.p1.y, 0);
        centerLine.vertices.push(Point);
        mapPiece = mapPiece.getNextPiece();
    }

    var line = new THREE.Line(centerLine, new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 5 }));

    scene.add(line);
}