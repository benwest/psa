var transform = require('./transform');

var deg = ( 1 / 360 ) * Math.PI * 2;

module.exports = bodies => {
    
    var selected = -1;
    
    window.addEventListener('keydown', e => {
        
        // Numbers
        
        if ( e.keyCode >= 48 && e.keyCode <= 57 ) {
            
            var idx = e.keyCode - 48 - 1;
            
            if ( bodies[ idx ] ) selected = idx;
            
        }
        
        // Arrows
        
        if ( selected > -1 ) {
            
            var body = bodies[ selected ];
            var path = body[ body.length - 1 ];
            
            if ( e.keyCode === 37 ) {
                
                path.rotation -= deg;
                
            } else if ( e.keyCode === 39 ) {
                
                path.rotation += deg;
                
            }
            
        }
        
    })
    
    window.addEventListener('keyup', e => {
        
        if ( e.keyCode >= 48 && e.keyCode <= 57 ) selected = -1;
        
    })
    
    window.addEventListener('mousemove', e => {
        
        if ( selected === -1 ) return;
        
        var body = bodies[ selected ];
        var path = body[ body.length - 1 ];
        
        var x = e.clientX - e.target.width / 2;
        var y = e.clientY - e.target.height / 2;
        
        transform.setPosition( path, x, y );
        
    })
    
}