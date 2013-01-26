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

var app = function(){
    'use strict';

    var container, controls,
        camera, scene, renderer,
        material,
        playerPlaceholder;

    //Halfsize of the window
    var halfWidth = window.innerWidth / 2;
    var halfHeight = window.innerHeight / 2;

    //Mouse position
    var mouseX = halfWidth;
    var mouseY = -halfHeight;

    //Two PI used in calculations
    var tau = Math.PI * 2;

    cameraLookahead = 500;

    return {
        init: function(){
            //Create container div
            container = document.createElement('div');
            //Append to the body
            document.body.appendChild(container);

            //Create the camera
            //(Field of vision, Aspect ratio, nearest point, farest point)
            camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);

            camera.position.set(0,1,-cameraLookahead);
            document.addEventListener( 'keypress', this.onKeyPress, false );

            //Create a new scene
            scene = new THREE.Scene();

             var ambient = new THREE.AmbientLight( 0x000000 );
             ambient.position.z = -300;
             scene.add( ambient );

             var directionalLight = new THREE.DirectionalLight( 0xffeedd );
             directionalLight.position.set( -10, 1, 30 );
             directionalLight.position.normalize();
             scene.add( directionalLight );

             var dLight = new THREE.DirectionalLight( 0xffeedd );
             dLight.position.set( 1, 0, 1 );
             dLight.position.normalize();
             scene.add( dLight );


            //Create the renderer, append to the container
            //renderer = new THREE.CanvasRenderer();
            renderer = new THREE.WebGLRenderer({'antialias': true});
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0';

            container.appendChild(renderer.domElement);

            //Add the mouse move event
            document.addEventListener('mousemove', this.mousemove, false);

            //Add player placeholder
            playerPlaceholder = new THREE.Mesh(
                new THREE.SphereGeometry(10,20,20),
                new THREE.MeshLambertMaterial({ color: 0xff00ff })
            );
            playerPlaceholder.position.x = 0;
            playerPlaceholder.position.z = 1100;
            scene.add(playerPlaceholder);


            //Draw the bottom grid
            var geometry = new THREE.Geometry();
            geometry.vertices.push( new THREE.Vector3( - 1000, 0, 0 ) );
            geometry.vertices.push( new THREE.Vector3( 1000, 0, 0 ) );

            material = new THREE.LineBasicMaterial( { color: 0x666666, opacity: 1 } );

            for ( var i = 0; i <= 40; i ++ ) {

                var line = new THREE.Line( geometry, material );
                line.position.y = 0;
                line.position.z = ( i * 50 ) - 1000;
                scene.add( line );

                var line = new THREE.Line( geometry, material );
                line.position.x = ( i * 50 ) - 1000;
                line.position.y = 0;
                line.rotation.y = 90 * Math.PI / 180;
                scene.add( line );

            }

            //Start the animation
            this.animate();
        },
        onKeyPress: function (e) {

            var keyCode = e.which;

            // backspace
            if ( keyCode == 8 ) {
                event.preventDefault();
            }

            if (keyCode == 119) {
                console.log('w');
                playerPlaceholder.position.x += 0.3;
                camera.lookAt(new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z-5 ));
            }

            if (keyCode == 97) {
                playerPlaceholder.position.z += 0.3;
                console.log('a');
            }

            if (keyCode == 115) {
                playerPlaceholder.position.x -= 0.3;
                console.log('s');
            }

            if (keyCode == 100) {
                playerPlaceholder.position.z -= 0.3;
                console.log('d');
            }

            //console.log(e);
        },
        mousemove: function(e){
            //X position = current mouse - half width
            mouseX = e.clientX - halfWidth;
            //Y position = current mouse - half height
            mouseY = e.clientY - halfHeight - 250;
        },
        radians: function(angle){
            //Angle supplied in degrees, needs to be converted to radians
            return angle * (Math.PI / 180);
        },
        animate: function(){
            //cameraLookahead += 3;
            tick++;
            //Animate using requestAnimFrame
            playerPlaceholder.position.set(
                playerPlaceholder.position.x + Math.sin(tick/70) * 5,
                playerPlaceholder.position.y,
                playerPlaceholder.position.z - 3
            );
            camera.position.set(
                playerPlaceholder.position.x,
                playerPlaceholder.position.y + 300,
                playerPlaceholder.position.z + cameraLookahead);
            camera.lookAt(
                new THREE.Vector3(camera.position.x, 0, camera.position.z - cameraLookahead)
            );

            requestAnimFrame(app.animate);
            app.render();
        },
        render: function(){
            renderer.render( scene, camera );
        }
    }
}();

ready(function(){
    app.init();
});
