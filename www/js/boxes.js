var paths = require('./paths');
var { Body, Box } = require('p2');
var vec2 = require('gl-vec2');

var ORIGINS = [{
    position: [ 156, -22 ],
    rotation: -18.5
},{
    position: [ -29, 60 ],
    rotation: -41.8
},{
    position: [ -70, 233 ],
    rotation: -6.6
},{
    position: [ -15, -172 ],
    rotation: 9.4
},{
    position: [ 51, 51 ],
    rotation: -10.5
}];

module.exports = paths.map( ( paths, i ) => {
    
    var path = paths[ 0 ];
    
    var width = path[ 0 ][ 1 ][ 0 ] * -2;
    var height = path[ 0 ][ 1 ][ 1 ] * -2;
    
    var { position, rotation } = ORIGINS[ i ];
    
    var body = new Body({
        mass: 200,
        position: vec2.clone( position ),
        angle: ( rotation / 360 ) * Math.PI * 2
    })
    
    var shape = new Box( { width, height } );
    
    body.addShape( shape );
    
    return body;
    
})