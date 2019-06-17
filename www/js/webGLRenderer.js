var paths = require('./paths');

var {
    Object3D,
    Shape,
    ShapeGeometry,
    Line,
    Mesh,
    LineBasicMaterial,
    WebGLRenderer,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    MeshBasicMaterial,
    BackSide
} = require("three");

var lineMaterial = new LineBasicMaterial( {linewidth: 1 / window.devicePixelRatio } );
var solidMaterial = new MeshBasicMaterial( { side: BackSide } )

if ( window.devicePixelRatio === 1 ) {
    
    lineMaterial.transparent = solidMaterial.transparent = true;
    lineMaterial.opacity = .7;
    
}

var meshes = paths.map( shapes => shapes.map( ( path, i ) => {
    
    var shape = new Shape();
    
    path.forEach( ( [ method, args ] ) => shape[ method ]( ...args ) );
    
    shape.closePath();
    
    var points = [];
    
    shape.curves.forEach( curve => {
        
        if ( curve.isLineCurve ) {
            
            points.push( ...curve.getPoints( 1 ) );
            
        } else {
            
            var l = curve.getLength();
            
            var res = Math.max( Math.floor( l / 5 ), 2 );
            
            points.push( ...curve.getPoints( res ) );
            
        }
        
    })
    
    var line = new Line(
        shape.createGeometry( points ),
        lineMaterial
    )
    
    if ( i === 0 ) {
        
        var group = new Object3D();
        
        var shapeMesh = new Mesh(
            new ShapeGeometry( shape ),
            solidMaterial
        );
        
        shapeMesh.position.z = 1;
        
        // shapeMesh.renderOrder = 1;
        // line.renderOrder = 2;
        
        group.add( shapeMesh, line );
        
        return group;
        
    } else {
        
        return line;
        
    }
    
}));

var lerp = ( a, b, t ) => a + ( b - a ) * t;

var interpolate = objects => {
    
    var count = objects.length - 1;
    var from = objects[ 0 ];
    var to = objects[ count ];
    
    return objects.map( ( object, i ) => {
        
        var t = i / count;
        
        object.position.x = lerp( from.position.x, to.position.x, t );
        object.position.y = lerp( from.position.y, to.position.y, t );
        object.rotation.z = lerp( from.rotation.z, to.rotation.z, t );
        
    });
    
}

var renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio || 1 )
document.body.appendChild( renderer.domElement );

var camera = new OrthographicCamera( -1, 1, 1, -1, 0, 1000 );
// var camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
camera.position.z = 10;

var scene = new Scene();

var group = new Object3D();
meshes.forEach( paths => group.add( ...paths ) );
scene.add( group );
group.scale.set( 1, -1, -1 );

function onResize () {
    
    
    
}

onResize();
window.addEventListener( 'resize', onResize );

module.exports = function draw ( boxes, options ) {
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.left = window.innerWidth / -2 * options.scale;
    camera.right = window.innerWidth / 2 * options.scale;
    camera.top = window.innerHeight / 2 * options.scale;
    camera.bottom = window.innerHeight / -2 * options.scale;
    camera.updateProjectionMatrix();
    
    lineMaterial.color.setStyle( options.strokeColor );
    solidMaterial.visible = options.fill;
    solidMaterial.color.setStyle( options.fillColor );
    
    boxes.forEach( ( box, i ) => {
        
        var blend = meshes[ i ];
        
        blend[ 0 ].position.set( box.interpolatedPosition[ 0 ], box.interpolatedPosition[ 1 ], 0 );
        blend[ 0 ].rotation.z = box.interpolatedAngle;
        
        interpolate( blend );
        
    })
    
    renderer.render( scene, camera );
    
}