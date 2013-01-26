function Point(x,y) {
    this.x = x;
    this.y = y;
}

// random seed?
Point.prototype.randomPos = function() {
    this.x = Math.random()*800;
    this.y = Math.random()*800;
    return this;
}

Point.prototype.startPos = function() {
    this.x = 0;
    this.y = 1000;
    return this;
}

Point.prototype.randomPosAtDistance = function(p, distance) {
    
    var angle = 120;// Math.random()*    60-30;
    this.x = p.x+distance*Math.cos(angle*Math.PI/180);
    this.y = p.y+distance*Math.cos(angle*Math.PI/180);
    return this;
}

function MapPiece(previousPiece) {
    
    this.previousPiece = previousPiece;
    this.connected_peaces = new Array();
    this.wallDistance = 10;
    
    
    // initialize first piece
    if(!previousPiece) {
        this.p1 = new Point().startPos();
        this.p2 = new Point().randomPosAtDistance(this.p1, 50);
    }
    else {
        this.p1 = this.previousPiece.p2;
        this.p2 = new Point().randomPosAtDistance(this.p1, 50);
        this.previousPiece.addChidPiece(this);
    }
}

MapPiece.prototype.addChidPiece = function(piece) {
    
    this.connected_peaces.push(piece);
}

MapPiece.prototype.getNextPiece = function() {
    
    return this.connected_peaces[0];
}

MapPiece.prototype.getBorder = function() {
    
    var p1 = this.previousPiece.p1;
    var p2 = this.p1;
    var p3 = this.p2;
    
    var l1k = (p1.x-p2.x)/(p1.y-p2.y);
    var l2k = (p2.x-p3.x)/(p2.y-p3.y);
    
    var l1p1 = this.moveDist(p1, this.wallDistance, l1k);
    var l1p2 = this.moveDist(p2, this.wallDistance, l1k);
    
    var l2p1 = this.moveDist(p2, this.wallDistance, l2k);
    var l2p2 = this.moveDist(p3, this.wallDistance, l2k);
    
    // intersection point between two lines at a distance
    var x = (-l2k*l1p1.x+l1p1.y+l1k*l2p2.x-l2p2.y)/(l1k-l2k);
    var y = l1k(x-l2p2.x)+l2p2.y;
    
    return new Point(x,y);
}

MapPiece.prototype.moveDist = function(point, dist, k) {
    
    var a = Math.atan(k);
    var dx = this.wallDistance*Math.cos(a);
    var dy = this.wallDistance*Math.sin(a);
    
    return new Point(point.x+dx, point.y+dy);
    
}