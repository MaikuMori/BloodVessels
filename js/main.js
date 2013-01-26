/**
 * TODO: split EVERYTHING in modules, move helpers to individual files etc.
 *
 * Some guidelines: for any global (new, without parent) function, please add 'use strict'
 */

var ready;

var app = {
    tick: 0,
    timeDelta: 0,
    timeCurrent: 0,
    timeLast: + new Date(),

    stats: new Stats(),

    cameraLookahead: 0,
    cameraDistanceZ: 1000,

    updateTimeDelta: function () {
        "use strict";

        this.timeCurrent = + new Date();
        this.timeDelta = this.timeCurrent - this.timeLast;
        this.timeLast = this.timeCurrent;
        this.tick += this.timeDelta;

        return this.timeDelta;
    },
    init: function () {
        "use strict";


        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.bottom = '0px';
        document.body.appendChild(this.stats.domElement);

        this.controls = false;

        // Half size of the window
        this.halfWidth = window.innerWidth / 2;
        this.halfHeight = window.innerHeight / 2;

        // Two PI used in calculations
        this.tau = Math.PI * 2;

        // Init keyboard state.
        this.keyboard = new THREEx.KeyboardState();

        // Create container div
        this.container = document.createElement('div');
        // Append to the body
        document.body.appendChild(this.container);

        // Create the camera
        // (Field of vision, Aspect ratio, nearest point, farest point)
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);

        this.camera.position.set(0, 0, this.cameraDistanceZ);

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
        this.renderer.setClearColorHex(0xEE1111, 1.0);
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
        this.playerPlaceholder.position.y = 0;
        this.playerPlaceholder.position.z = 0;
        this.scene.add(this.playerPlaceholder);

        this.playerDirection = new THREE.Mesh(
            new THREE.SphereGeometry(5, 5, 5),
            new THREE.MeshLambertMaterial({ color: 0xff00ff })
        );
        this.playerDirection.position.x = 0;
        this.playerDirection.position.y = 10;
        this.playerDirection.position.z = 0;
        this.playerPlaceholder.add(this.playerDirection);

        //Draw the bottom grid
        this.geometry = new THREE.Geometry();
        this.geometry.vertices.push(new THREE.Vector3(-1000, 0, 0));
        this.geometry.vertices.push(new THREE.Vector3(1000, 0, 0));

        this.material = new THREE.LineBasicMaterial({
            color: 0x666666,
            opacity: 1
        });

        this.map = new Map().generate().addToScene(this.scene);

        this.streamForce = new THREE.Vector2(0, 1);
        this.strugleVector = new THREE.Vector2(0, 0);
        this.moveBy = new THREE.Vector2(0, 0);

        this.pulse = 0.01;
        this.pulseState = 0;
        this.bpm = 60.0;
        this.beat = (function () {
            this.pulseState = 1;
            setTimeout(this.beat, (1000 * 60) / this.bpm);
        }).bind(this);
        this.beat();

        // GUI.
        this.GUI = new dat.GUI();
        this.GUI.add(this, 'pulse', -1, 1).listen();


        //Start the main loop.
        this.mainLoop = this.mainLoop.bind(this);
        this.mainLoop();
    },
    onResize: function (e) {

    },
    radians: function (angle) {
        //Angle supplied in degrees, needs to be converted to radians
        return angle * (Math.PI / 180);
    },
    handleInputs: function () {
        var dX = 0, dY = 0;

        if (app.keyboard.pressed('left')) {
            //dX -= 0.05;
            app.playerPlaceholder.rotation.z += 0.05;
        } else if (app.keyboard.pressed('right')) {
            //dX += 0.05;
            app.playerPlaceholder.rotation.z -= 0.05;
        }

        if (app.keyboard.pressed('down')) {
            dY -= 0.05;
        } else if (app.keyboard.pressed('up')) {
            dY += 0.05;
        }
        app.strugleVector.set(dX, dY);
    },
    handlePulse: function( ) {
        switch (this.pulseState) {
            case 0:
                // Do nothing.
                break;
            case 1:
                // Beat.
                this.pulse += 0.06 * (60 / this.bpm);
                if (this.pulse > 1) {
                    this.pulse = 1;
                    this.pulseState = 2;
                }
                break;
            case 2:
                // Stop and recoil :D.
                this.pulse -= 0.07 *  (60 / this.bpm);
                if (this.pulse < -0.3) {
                    this.pulse = -0.3;
                    this.pulseState = 3;
                }
                break;
            case 3:
                // Even out and done.
                this.pulse += 0.05 * (60 / this.bpm);
                if (this.pulse > 0) {
                    this.pulse = 0;
                    this.pulseState = 0;
                }
                break;
        }
    },
    mainLoop: function () {
        this.stats.begin();
        var dt = this.updateTimeDelta();
        this.handleInputs();
        // Figure out what's the pulse value atm.
        this.handlePulse();
        this.streamForce.set(0, 0.3);
        this.moveBy.addVectors(this.streamForce, this.strugleVector);

        this.playerPlaceholder.position.set(
            app.playerPlaceholder.position.x + this.moveBy.x * dt,
            app.playerPlaceholder.position.y + this.moveBy.y + (this.pulse * 0.03) * dt,
            app.playerPlaceholder.position.z
        );

        this.camera.position.x += this.moveBy.x * td;
        this.camera.position.y += this.moveBy.y * td;
        this.camera.rotation.z = app.playerPlaceholder.rotation.z;
        //this.camera.position.z

        /*
        this.camera.position.set(
            this.playerPlaceholder.position.x,
            this.playerPlaceholder.position.y,
            this.playerPlaceholder.position.z + this.cameraDistanceZ //  // + app.cameraLookahea
        );
        this.camera.lookAt(
            this.playerPlaceholder.position
        );
        */

        window.requestAnimFrame(app.mainLoop);
        this.render();
        this.stats.end();
    },
    render: function () {
        this.renderer.render(this.scene, this.camera);
    }

};

ready(function () {
    app.init();
});
