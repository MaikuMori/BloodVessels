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
    this.y = -200;
    return this;
}

Point.prototype.randomPosAtDistance = function(p, distance, angle) {
    
    this.x = p.x+distance*Math.cos(angle*Math.PI/180);
    this.y = p.y+distance*Math.sin(angle*Math.PI/180);
    return this;
}

function MapPiece(previousPiece) {
    
    this.previousPiece = previousPiece;
    this.connected_peaces = new Array();
    this.wallDistance = 50;
    
    
    // initialize first piece
    if(!previousPiece) {
        this.p1 = new Point().startPos();
        this.angle = 90;
        //this.p2 = new Point().randomPosAtDistance(this.p1, 100, this.angle);
    }
    else {
        //this.p1 = this.previousPiece.p2;
        this.angle = this.previousPiece.angle;
        this.randomizeAngle()
        this.p1 = new Point().randomPosAtDistance(this.previousPiece.p1, 10, this.angle);
        this.previousPiece.addChildPiece(this);
    }
}

MapPiece.prototype.randomizeAngle = function(){
    this.angle+= Math.random()*20-10;
    
    if(this.angle > 150)this.angle = 150;
    if(this.angle < 60) this.angle = 60;
}

MapPiece.prototype.addChildPiece = function(piece) {
    
    this.connected_peaces.push(piece);
}

MapPiece.prototype.getNextPiece = function() {
    
    return this.connected_peaces[0];
}

MapPiece.prototype.getBorderPointRight = function() {
    
    return new Point(this.p1.x+100,this.p1.y)
    
    
    var p1 = this.previousPiece.p1;
    var p2 = this.previousPiece.p2;
    var p3 = this.p1;
    var p4 = this.p2;
    
    var k1 = (p2.x-p1.x)/(p2.y-p1.y);
    var k2 = (p4.x-p3.x)/(p4.y-p3.y);
    
    var l1p1 = this.moveDist(p1, this.wallDistance, k1);
    var l1p2 = this.moveDist(p2, this.wallDistance, k1);
    
    var l2p1 = this.moveDist(p3, this.wallDistance, k2);
    var l2p2 = this.moveDist(p4, this.wallDistance, k2);
    
    // intersection point between two lines at a distance
    var x = (-k2*l1p2.x+l1p2.y+k1*l2p1.x-l2p1.y)/(k1-k2);
    //console.log(x-p2.x);
    var y = k2*(x-l2p1.x)+l2p1.y;
    //console.log(y-p2.y);
    //console.log(x,y);
    return new Point(x,y);
}

MapPiece.prototype.getBorderPointLeft = function() {
    
    return new Point(this.p1.x-100,this.p1.y)
}

MapPiece.prototype.drawMap = function(scene, map) {
    
    var p1,p2;

    this.mapLines = new THREE.Object3D()

    // center line
    var centerLine = new THREE.Geometry();
    p1 = this.previousPiece.p1;
    p2 = this.p1;
    centerLine.vertices.push(new THREE.Vector3(p1.x, p1.y, 0));
    centerLine.vertices.push(new THREE.Vector3(p2.x, p2.y, 0));
    this.centerLineThree = new THREE.Line(centerLine, 
            new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 2 }));
    this.mapLines.add(this.centerLineThree);
    
    // right line 
    var rightLine = new THREE.Geometry();
    p1 = this.getBorderPointRight();
    p2 = this.previousPiece.getBorderPointRight();
    rightLine.vertices.push(new THREE.Vector3(p1.x,p1.y, 0));
    rightLine.vertices.push(new THREE.Vector3(p2.x, p2.y, 0));
    this.rightLineThree = new THREE.Line(rightLine, 
            new THREE.LineBasicMaterial({ color: 0xcc00ff, linewidth: 2 }));
    this.mapLines.add(this.rightLineThree);
    
    // left line 
    var leftLine = new THREE.Geometry();
    p1 = this.getBorderPointLeft();
    p2 = this.previousPiece.getBorderPointLeft();
    leftLine.vertices.push(new THREE.Vector3(p1.x,p1.y, 0));
    leftLine.vertices.push(new THREE.Vector3(p2.x, p2.y, 0));
    this.leftLineThree = new THREE.Line(leftLine, 
            new THREE.LineBasicMaterial({ color: 0x00ffcc, linewidth: 2 }));
    this.mapLines.add(this.leftLineThree);

    //scene.add(this.mapLines);
    
    map.addMapLines(this.mapLines);
    return this;
}

MapPiece.prototype.moveDist = function(point, dist, k) {
    
    var x1 = point.x;
    var y1 = point.y;
    
    var x2 = x1+5;
    
    var y2 = k*(x2-x1)+y1;
    
    //return new Point(x2,y2);
    
    var dx3 = x2-x1;
    var dy3 = y2-y1;
    
    var len = Math.sqrt((dx3)*(dx3)+(dy3)*(dy3));
    
    dx3 = dx3/len*dist;
    dy3 = dy3/len*dist;
    
//    if(k>0 && k <=1) {
//        return new Point(x1+dx3,y1+dy3);
//    }
//    else if(k>1) {
//        return new Point(x1-dx3,y1-dy3);
//    }
//    else if(k<0 && k>=-1) {
//        console.log(dx3, dy3);
//        return new Point(x1+dx3,y1-dy3);
//    }
    return new Point(x1+dx3,y1+dy3);
    
//    var a = Math.atan(k);
//    var dx = this.wallDistance*Math.cos(a);
//    var dy = this.wallDistance*Math.sin(a);
//    
//    return new Point(point.x-dx, point.y+dy);
    
}
