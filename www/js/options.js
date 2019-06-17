var gui = require('./gui');

var options = {
    
    scale: 1,
    
    backgroundColor: '#000000',
    strokeColor: '#FFFFFF',
    fill: true,
    fillColor: '#FFFFFF',
    
    collisions: true,
    snapPower: 1000,
    snapDistance: 500,
    
    pullPower: 1000,
    pullDistance: 400,
    pushPower: 100000,
    pushDistance: 400
    
}

var appearance = gui.addFolder('Appearance');

appearance.addColor( options, 'backgroundColor' ).name('Background');
appearance.addColor( options, 'strokeColor' ).name('Stroke');
appearance.add( options, 'fill' ).name('Fill');
appearance.addColor( options, 'fillColor' ).name('Fill color');

var physics = gui.addFolder('Physics');
physics.add( options, 'collisions' ).name( 'Collisions' );
physics.add( options, 'snapPower', 0, 5000 ).name( 'Snap Power' );
physics.add( options, 'snapDistance', 0, 1000 ).name( 'Snap Distance' );

var mouse = gui.addFolder( 'Mouse' );
mouse.add( options, 'pullPower', 0, 5000 ).name('Pull Power');
mouse.add( options, 'pullDistance', 0, 1000 ).name('Pull Distance');
mouse.add( options, 'pushPower', 0, 500000 ).name('Push Power');
mouse.add( options, 'pushDistance', 0, 1000 ).name('Push Distance');

gui.remember( options );

module.exports = options;