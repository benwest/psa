var boxes = require('./boxes');
var update = require('./physics')( boxes );
var draw = require('./webGLRenderer');

// var recorder = require('./recorder');
var options = require('./options');

var tick = () => {
    
    options.scale = Math.max( 600 / window.innerWidth, 1100 / window.innerHeight );
    
    update( options );
    
    draw( boxes, options );
    
    requestAnimationFrame( tick );
    
    // recorder.frame( boxes );
    
};

tick();