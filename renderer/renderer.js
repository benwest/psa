var fs = require('fs')
var Canvas = require('canvas');
var leftPad = require('left-pad');
var draw = require('../www/js/canvasRenderer');
var boxes = require('../www/js/boxes');
var exec = require('child_process').exec;

var canvas = new Canvas( 2000, 2000 );
var ctx = canvas.getContext( '2d' );

var queue = [];

var working = false;

var next = () => {
    
    if ( !queue.length ) {
        working = false;
        return;
    }
    
    working = true;
    
    var frame = queue.shift();
    
    applyTransform( frame.data );
    
    draw( boxes, frame.options, ctx );
    
    canvas.toBuffer( ( error, buffer ) => {
        
        fs.writeFile( `frames/${ frame.id }_${ leftPad( frame.i, 5, '0' ) }.png`, buffer, () => {
            frame.progress();
            next();
        });
        
    })
    
}

function applyTransform ( frame ) {
    
    boxes.forEach( ( box, i ) => {
        
        var transform = frame[ i ];
        
        box.position[ 0 ] = transform[ 0 ];
        box.position[ 1 ] = transform[ 1 ];
        box.angle = transform[ 2 ];
        
    })
    
}

function writeVideo ( id ) {
    
    var status = renderer.progress[ id ];
    
    status.status = 'video';
    
    exec( `ffmpeg -i frames/${id}_%05d.png -vcodec png frames/${id}.mov`, () => {
        
        status.status = 'done';
        status.data = `download/${id}.mov`;
        
        fs.writeFile( 'data.json', JSON.stringify( renderer.progress ) );
        
    });
    
}

var renderer = {
    
    progress: JSON.parse( fs.readFileSync('data.json') ),
    
    render: data => {
        
        console.log( 'Rendering?' )
        
        var { tape, options } = data;
        
        options.scale = 2;
        
        var id = renderer.progress.length;
        
        var done = 0;
        
        var status = { status: "waiting", data: 0 };
        
        renderer.progress.push( status );
        
        tape.forEach( ( frame, i ) => {
            
            queue.push({
                data: frame,
                options,
                i,
                id,
                progress: () => {
                    
                    done++;
                    
                    if ( done === tape.length ) {
                        
                        writeVideo( id );
                        
                    } else {
                        
                        status.status = 'frames';
                        
                        status.data = done + '/' + tape.length;
                        
                    }
                    
                    console.log( id, status.data );
                    
                }
            })
            
        })
        
        if ( !working ) next();

    }
    
}

module.exports = renderer;