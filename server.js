var fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser')
var renderer = require('./renderer/renderer');
// var leftPad = require('left-pad');
// var execSync = require('child_process').execSync;

var app = express();

app.use( bodyParser.json({limit: '100mb'}) );
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use( express.static('www') );

app.post( '/render', ( req, res ) => {
    
    renderer.render( req.body );
    
    res.sendStatus( 200 );
    
})

app.get('/download/:file', (req, res) => {
    
    res.download( __dirname + '/frames/' + req.params.file );
    
})

app.get('/progress', ( req, res ) => res.send( renderer.progress ) );

app.listen( process.env.PORT || 8000, () => console.log('👍🏻') );