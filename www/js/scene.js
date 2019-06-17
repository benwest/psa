var curves = require('./curves');
var vec2 = require('gl-vec2');

module.exports = curves.map( paths => paths.map( path => {
    
    return {
        rotation: 0,
        position: vec2.create(),
        visible: true
    }
    
}))