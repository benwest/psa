var xhr = require('xhr');

module.exports = ( tape, options ) => {
    
    console.log( tape, options );
    
    xhr({
        url: '/render',
        method: "POST",
        json: true,
        body: { tape, options }
    }, () => {})
    
}