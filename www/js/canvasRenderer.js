var vec2 = require('gl-vec2');
var paths = require('./paths');

if ( typeof document !== 'undefined' ) {

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    document.body.appendChild( canvas );

    function onResize() {
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
    }
    
    window.addEventListener('resize', onResize);
    
    onResize();

}

var lerp = ( a, b, t ) => a + ( b - a ) * t;

var lerpObject = ( object, from, to, t ) => {
    
    vec2.lerp( object.position, from.position, to.position, t );
    object.rotation = lerp( from.rotation, to.rotation, t );
    
    return object;
    
}

var interpolate = objects => {
    
    var count = objects.length - 1;
    var from = objects[ 0 ];
    var to = objects[ count ];
    
    return objects.map( ( o, i ) => lerpObject( o, from, to, i / count ) );
    
}

var scene = paths.map( blend => blend.map( path => {
    
    return {
        path,
        position: vec2.create(),
        rotation: 0,
        visible: true
    }
    
}))

function drawPath( ctx, obj ) {
    
    if ( !obj.visible ) return;
    
    ctx.save();
    
    ctx.translate( obj.position[ 0 ], obj.position[ 1 ] );
    ctx.rotate( obj.rotation );
    
    obj.path.forEach( draw => {
    
        var method = draw[ 0 ];
        var args = draw[ 1 ];
        
        ctx[ method ].apply( ctx, args );
    
    });
    
    ctx.restore();
    
}

module.exports = ( boxes, options, ctx = context ) => {
    
    scene.forEach( ( blend, i ) => {
        
        var box = boxes[ i ];
        
        vec2.copy( blend[ 0 ].position, box.position );
        blend[ 0 ].rotation = box.angle;
        
        interpolate( blend );
        
    })
    
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    
    ctx.save();
    
    ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
    ctx.scale( options.scale || 1, options.scale || 1 );
    
    if ( options.fill ) {
        
        ctx.fillStyle = options.fillColor;
        
        scene.forEach( blend => {
            
            var rect = blend[ 0 ];
            
            ctx.beginPath();
            drawPath( ctx, rect );
            ctx.fill();
            
            ctx.beginPath();
            drawPath( ctx, rect );
            ctx.stroke();
            
        })

    }
    
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = .5;
    
    ctx.beginPath();
    
    scene.forEach( blend => blend.forEach( path => drawPath( ctx, path ) ) );
    
    ctx.stroke();
    
    ctx.restore();
    
}