/**
 * TODO: split EVERYTHING in modules, move helpers to individual files etc.
 *
 * Some guidelines: for any global (new, without parent) function, please add 'use strict'
 */

var tick = 0;

/**
 * Document "ready" event helper via http://stackoverflow.com/a/7053197/261857
 * (jQuery, you're cool, but we don't need you)
 */
var ready;

var cameraLookahead; // exposed for now

var app = {
    init: function () {
        "use strict";
        this.controls = false;

        //Halfsize of the window
        this.halfWidth = window.innerWidth / 2;
        this.halfHeight = window.innerHeight / 2;

        //Mouse position
        this.mouseX = this.halfWidth;
        this.mouseY = -this.halfHeight;

        //Two PI used in calculations
        this.tau = Math.PI * 2;

        this.cameraLookahead = 500;


        // Events
        window.onresize = this.onResize;

        //Create container div
        this.container = document.createElement('div');
        //Append to the body
        document.body.appendChild(this.container);

        //Create the camera
        //(Field of vision, Aspect ratio, nearest point, farest point)
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);

        this.camera.position.set(0, 1, -this.cameraLookahead);

        //Create a new scene
        this.scene = new THREE.Scene();

        this.ambient = new THREE.AmbientLight(0x000000);
        this.ambient.position.z = -300;
        this.scene.add(this.ambient);

        this.directionalLight = new THREE.DirectionalLight(0xffeedd);
        this.directionalLight.position.set(-10, 1, 30);
        this.directionalLight.position.normalize();
        this.scene.add(this.directionalLight);

        this.dLight = new THREE.DirectionalLight(0xffeedd);
        this.dLight.position.set(1, 0, 1);
        this.dLight.position.normalize();
        this.scene.add(this.dLight);


        //Create the renderer, append to the container
        //renderer = new THREE.CanvasRenderer();
        this.renderer = new THREE.WebGLRenderer({'antialias': true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';

        this.container.appendChild(this.renderer.domElement);

        //Add player placeholder
        this.playerPlaceholder = new THREE.Mesh(
            new THREE.SphereGeometry(10, 20, 20),
            new THREE.MeshLambertMaterial({ color: 0xff00ff })
        );
        this.playerPlaceholder.position.x = 0;
        this.playerPlaceholder.position.z = 1100;
        this.scene.add(this.playerPlaceholder);


        //Draw the bottom grid
        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
        this.geometry.vertices.push(new THREE.Vector3(1000, 0, 0));

        this.material = new THREE.LineBasicMaterial({
            color: 0x666666,
            opacity: 1
        });

        for (var  i = 40; i >= 0; i--) {
            var line = new THREE.Line(this.geometry, this.material);
            line.position.y = 0;
            line.position.z = (i * 50) - 1000;
            this.scene.add(line);

            line = new THREE.Line(this.geometry, this.material);
            line.position.x = (i * 50) - 1000;
            line.position.y = 0;
            line.rotation.y = 90 * Math.PI / 180;
            this.scene.add(line);

        }

        //Start the animation
        this.animate();
    },
    onResize: function (e) {

    },
    radians: function (angle) {
        //Angle supplied in degrees, needs to be converted to radians
        return angle * (Math.PI / 180);
    },
    animate: function () {
        //cameraLookahead += 3;
        tick++;
        //Animate using requestAnimFrame
        this.playerPlaceholder.position.set(
            this.playerPlaceholder.position.x + Math.sin(tick / 70) * 5,
            this.playerPlaceholder.position.y,
            this.playerPlaceholder.position.z - 3
        );
        this.camera.position.set(
            this.playerPlaceholder.position.x,
            this.playerPlaceholder.position.y + 300,
            this.playerPlaceholder.position.z + this.cameraLookahead);
        this.camera.lookAt(
            new THREE.Vector3(this.camera.position.x, 0, this.camera.position.z - this.cameraLookahead)
        );

        this.requestAnimFrame(app.animate);
        app.render();
    },
    render: function () {
        this.renderer.render(this.scene, this.camera);
    }

};

ready(function () {
    app.init();
});
