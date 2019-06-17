var vec2 = require('gl-vec2');
// var gui = require('./gui');
var zip = require('lodash/zip');

var mapValue = ( value, inMin, inMax, outMin, outMax ) =>
    outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);

var { World, Body, Box, LinearSpring, RotationalSpring } = require('p2');

module.exports = function ( boxes ) {
    
    var options = {
        linear: {
            stiffness: 500,
            damping: 500
        },
        rotational: {
            stiffness: 2000000,
            damping: 50000
        },
        collisionResponse: true
    }
    
    var center = vec2.create();
    
    function onResize () {
        vec2.set( center, window.innerWidth / 2, window.innerHeight / 2 );
    }
    
    onResize();
    window.addEventListener( 'resize', onResize );
    
    var world = new World({
        gravity: [ 0, 0 ]
    });
    
    var [ origins, rects, linearSprings, rotationalSprings ] = zip( ...boxes.map( box => {
        
        var origin = {
            position: vec2.clone( box.position ),
            rotation: box.angle
        };
        
        world.addBody( box );
        
        var pin = new Body({
            mass: 0,
            position: vec2.clone( box.position )
        })
        
        world.addBody( pin );
        
        var lSpring = new LinearSpring( box, pin, options.linear );
        world.addSpring( lSpring );
        
        var rSpring = new RotationalSpring( box, pin, options.rotational );
        world.addSpring( rSpring );
        
        return [ origin, box, lSpring, rSpring ];
        
    }))
    
    var mousedown = false;
    var mouse = vec2.create();
    
    var pushes = [];
    
    window.addEventListener( 'mousedown', () => mousedown = true );
    window.addEventListener( 'touchstart', () => mousedown = true );
    window.addEventListener( 'mouseup', () => mousedown = false );
    window.addEventListener( 'touchend', () => mousedown = false );
    window.addEventListener( 'mousemove', e => vec2.set( mouse, e.clientX, e.clientY ) );
    window.addEventListener( 'touchmove', e => {
        var t = e.touches[ 0 ];
        vec2.set( mouse, t.clientX, t.clientY );
    })
    
    var updateArray = ( array, property, value ) => {
        array.forEach( obj => obj[ property ] = value );
    }
    
    var then;
    
    var toOrigin = vec2.create();
    var direction = vec2.create();
    
    var springStrength = 500;
    
    return function update ( options ) {
        
        updateArray( rects, 'collisionResponse', options.collisions )
        
        var now = Date.now();
        
        var dT = then ? Math.min( now - then, 16 ) / 1000 : 0;
        
        world.step( 1 / 24, 1/24 );
        
        rects.forEach( ( rect, i ) => {
            
            var origin = origins[ i ];
            
            vec2.subtract( toOrigin, origin.position, rect.position );
            vec2.normalize( direction, rect.velocity );
            
            var f = vec2.create();
            vec2.subtract( f, origin.position, rect.position );
            
            var strength = mapValue( vec2.length( toOrigin ), 0, options.snapDistance, 1, 0 );
            strength = Math.max( Math.min( strength, 1 ), 0 );
            
            vec2.scale( f, f, strength * options.snapPower );
            rect.applyForce( f );
            
            rect.angularVelocity *= .97;
            vec2.scale( rect.velocity, rect.velocity, .95 )
            
            linearSprings[ i ].stiffness = springStrength;
            
        })
        
        if ( springStrength < 500 ) springStrength++;
        
        var force = vec2.create();
        var worldMouse = vec2.create();
        vec2.subtract( worldMouse, mouse, center );
        vec2.scale( worldMouse, worldMouse, options.scale )
        
        if ( mousedown ) {
            
            springStrength = 100;
            
            rects.forEach( rect => {
                
                vec2.subtract( force, rect.position, worldMouse );
                
                var d = vec2.length( force );
                
                vec2.normalize( force, force );
                
                var power = Math.max( options.pushDistance - d, 0 ) / options.pushDistance;
                
                vec2.scale( force, force, power * options.pushPower )
                
                var localClick = vec2.create();
                
                rect.toLocalFrame( localClick, worldMouse );
                
                rect.applyImpulse( force, localClick );
                
            })
        
        } else {
            
            rects.forEach( rect => {
                
                vec2.subtract( force, worldMouse, rect.position );
                
                var d = vec2.length( force );
                
                vec2.normalize( force, force );
                
                var power = Math.max( options.pullDistance - d, 0 ) / options.pullDistance;
                
                vec2.scale( force, force, power * options.pullPower )
                
                rect.applyImpulse( force )
                
            })
            
        }
    
        then = now;
        
    }
    
}