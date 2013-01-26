/**
 * TODO: split EVERYTHING in modules, move helpers to individual files etc.
 *
 * Some guidelines: for any global (new, without parent) function, please add 'use strict'
 */

/**
 * Document "ready" event helper via http://stackoverflow.com/a/7053197/261857
 * (jQuery, you're cool, but we don't need you)
 */
var ready;
var tick = 0;
ready = (function () {
    'use strict';

    var readyList,
        DOMContentLoaded,
        class2type = {};
    class2type["[object Boolean]"] = "boolean";
    class2type["[object Number]"] = "number";
    class2type["[object String]"] = "string";
    class2type["[object Function]"] = "function";
    class2type["[object Array]"] = "array";
    class2type["[object Date]"] = "date";
    class2type["[object RegExp]"] = "regexp";
    class2type["[object Object]"] = "object";

    var ReadyObj = {
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady:false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait:1,
        // Hold (or release) the ready event
        holdReady:function (hold) {
            if (hold) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready(true);
            }
        },
        // Handle when the DOM is ready
        ready:function (wait) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ((wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady)) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (!document.body) {
                    return setTimeout(ReadyObj.ready, 1);
                }

                // Remember that the DOM is ready
                ReadyObj.isReady = true;
                // If a normal DOM Ready event fired, decrement, and wait if need be
                if (wait !== true && --ReadyObj.readyWait > 0) {
                    return;
                }
                // If there are functions bound, to execute
                readyList.resolveWith(document, [ ReadyObj ]);

                // Trigger any bound ready events
                //if ( ReadyObj.fn.trigger ) {
                //  ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
                //}
            }
        },
        bindReady:function () {
            if (readyList) {
                return;
            }
            readyList = ReadyObj._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if (document.readyState === "complete") {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout(ReadyObj.ready, 1);
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if (document.addEventListener) {
                // Use the handy event callback
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                // A fallback to window.onload, that will always work
                window.addEventListener("load", ReadyObj.ready, false);

                // If IE event model is used
            } else if (document.attachEvent) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent("onreadystatechange", DOMContentLoaded);

                // A fallback to window.onload, that will always work
                window.attachEvent("onload", ReadyObj.ready);

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch (e) {
                }

                if (document.documentElement.doScroll && toplevel) {
                    doScrollCheck();
                }
            }
        },
        _Deferred:function () {
            var // callbacks list
                callbacks = [],
            // stored [ context , args ]
                fired,
            // to avoid firing when already doing so
                firing,
            // flag to know if the deferred has been cancelled
                cancelled,
            // the deferred itself
                deferred = {

                    // done( f1, f2, ...)
                    done:function () {
                        if (!cancelled) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if (fired) {
                                _fired = fired;
                                fired = 0;
                            }
                            for (i = 0, length = args.length; i < length; i++) {
                                elem = args[ i ];
                                type = ReadyObj.type(elem);
                                if (type === "array") {
                                    deferred.done.apply(deferred, elem);
                                } else if (type === "function") {
                                    callbacks.push(elem);
                                }
                            }
                            if (_fired) {
                                deferred.resolveWith(_fired[ 0 ], _fired[ 1 ]);
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith:function (context, args) {
                        if (!cancelled && !fired && !firing) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while (callbacks[ 0 ]) {
                                    callbacks.shift().apply(context, args);//shifts a callback, and applies it to document
                                }
                            }
                            finally {
                                fired = [ context, args ];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve:function () {
                        deferred.resolveWith(this, arguments);
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved:function () {
                        return !!( firing || fired );
                    },

                    // Cancel
                    cancel:function () {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },
        type:function (obj) {
            return obj == null ?
                String(obj) :
                class2type[ Object.prototype.toString.call(obj) ] || "object";
        }
    }
    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
        if (ReadyObj.isReady) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }

        // and execute any waiting functions
        ReadyObj.ready();
    }

    // Cleanup functions for the document ready method
    if (document.addEventListener) {
        DOMContentLoaded = function () {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            ReadyObj.ready();
        };

    } else if (document.attachEvent) {
        DOMContentLoaded = function () {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                ReadyObj.ready();
            }
        };
    }
    function ready(fn) {
        // Attach the listeners
        ReadyObj.bindReady();

        var type = ReadyObj.type(fn);

        // Add the callback
        readyList.done(fn);//readyList is result of _Deferred()
    }

    return ready;
})();

// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

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

            /*
            controls = new THREE.TrackballControls(camera);

            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;

            controls.noZoom = false;
            controls.noPan = false;

            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;

            controls.target.set( 20, 0, 0 );
            controls.keys = [ 65, 83, 68 ];

            controls.addEventListener( 'change', this.render );
            */

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
            //Create the tree
            this.branch(0, 0, 0, 100, this.radians(5));//x, z, y, height, angle

            //Start the animation
            this.animate();
        },
        onKeyPress: function (e) {

            var keyCode = e.which;

            /*
             if(this.moveForward) camera.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
             if(this.moveBackward) camera.translateZ(actualMoveSpeed);

             if(this.moveLeft) camera.translateX(-actualMoveSpeed);
             if(this.moveRight) camera.translateX(actualMoveSpeed);

             //look movement
             this.lon += this.mouseMovementX;
             this.lat -= this.mouseMovementY;

             this.mouseMovementX = 0; //reset mouse deltas to 0 each rendered frame
             this.mouseMovementY = 0;

             this.phi = (90 - this.lat) * Math.PI / 180;
             this.theta = this.lon * Math.PI / 180;

             if(this.constrainVertical) {
             this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
             }

             this.target.x = camera.position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
             this.target.y = camera.position.y + 100 * Math.cos(this.phi);
             this.target.z = camera.position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

             camera.lookAt(this.target);

             */
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
        random: function(r1, r2){
            //Pick a random number between r1 and r2
            //More useful than Math.random() which is between 0 and 1
            return ((Math.random()*(r2 - r1)) + r1);
        },
        weightedRandom: function(){
            //More likely to return true than false

            //return false;

            var val = Math.round(Math.random()*10);
            switch(val){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    return false;
                default:
                    return true;
            }
        },
        branch: function(x, y, z, length, angle){//Start position of the tree base (x,y,z), length and angles
            //Setup new material and geometry
            material = new THREE.MeshBasicMaterial({color: 0xffffff});
            geometry = new THREE.Geometry();

            //Define the start point
            particle = new THREE.Particle(material);
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
            //console.log('from', x, y, z);

            //Add the new particle to the scene
            scene.add(particle);

            //Add the particle position into the geometry object
            geometry.vertices.push( new THREE.Vector3( particle.position ) );

            //Create the second points where the branches end
            var newx = x + Math.cos(angle) * length;
            var newy = y + Math.sin(angle) * length;
            var newz = z - Math.sin(angle) * this.random(-50, 50);

            //Create the second point
            var particle = new THREE.Particle(material);
            particle.position.x = newx;
            particle.position.y = newy;
            particle.position.z = newz;
            //Add the new particle to the scene
            scene.add(particle);
            //console.log('to', newx, newy, newz);

            //Add the particle position into the geometry object
            geometry.vertices.push( new THREE.Vector3( particle.position ) );

            var lineWidth = length * 0.03;

            /**/
            var material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(x, y, z));
            geometry.vertices.push(new THREE.Vector3(newx, newy, newz));
            var line2 = new THREE.Line(geometry, material);
            scene.add(line2);

            //Create multiple branches, if still long branches add a new set
            if(length > 10){
                //First: branch calls itself, positioned at the end of older brance, random angle between these values
                this.branch(newx, newy, newz, length * (this.random(0.5, 0.80)), angle - this.radians(this.random(17, 12)));
                if(!this.weightedRandom()){
                    this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle - this.radians(this.random(0, 17)));
                }
                if(!this.weightedRandom()){
                    this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle - this.radians(this.random(0, 17)));
                }

                /*
                 if(!this.weightedRandom()){
                 //Second: branch calls itself, positioned at the end of older brance, random angle between these values
                 this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle + this.radians(this.random(17, 12)));
                 }

                 if(!this.weightedRandom()){
                 //Third: branch calls itself, positioned at the end of older brance, random angle between these values
                 this.branch(newx, newy, newz, length * (this.random(0.55, 0.80)), angle + this.radians(this.random(17, 12)) - this.radians(this.random(17, 12)) );
                 }
                 */
            } else {
                // endpoints
            }
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
            //asd
            //controls.update();
            //var a = camera.position.x + 0.5
            //camera.position.x = a;
            //controls.target.set( a+20, 1, 0);
            //Render the scene
            app.render();
        },
        render: function(){
            //time = new Date().getTime() * 0.0003;

            //Set camera position depending on the mouse position
            //camera.position.x += (mouseX - camera.position.x) * 0.17;
            //camera.position.y += (-mouseY - camera.position.y) * 0.17;


            /*
             var theta = - ( ( mouseX ) * 0.5 );
             var phi = ( ( mouseY ) * 0.5 );
             var radious = 300;
             phi = Math.min( 180, Math.max( 0, phi ) );

             camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
             * Math.cos( phi * Math.PI / 360 );
             camera.position.y = 100 + radious * Math.sin( phi * Math.PI / 360 );
             camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
             * Math.cos( phi * Math.PI / 360 );
             camera.updateMatrix();
             camera.lookAt(new THREE.Vector3( 300, 250, 0 ))
             */

            renderer.render( scene, camera );
        }
    }
}();

ready(function(){
    app.init();
});
