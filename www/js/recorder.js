var m = require('mithril');
var render = require('./render');
var cloneDeep = require('lodash/cloneDeep');
var options = require('./options');

var recorder = {
    recording: false,
    tape: [],
    options: {},
    frame: boxes => {
        if( !recorder.recording ) return;
        recorder.tape.push( boxes.map( box => {
            return [
                box.position[ 0 ],
                box.position[ 1 ],
                box.angle
            ]
        }))
    },
    record: () => {
        if ( recorder.recording ) return;
        recorder.options = cloneDeep( options );
        recorder.recording = true;
    },
    done: () => {
        if ( !recorder.recording ) return;
        render( recorder.tape, recorder.options );
        recorder.tape = [];
        recorder.recording = false;
    },
    cancel: () => {
        if ( !recorder.recording ) return;
        recorder.tape = [];
        recorder.recording = false;
    }
}

var UI = {
    
    getProgress: vnode => {
        
        m.request({
            url: '/progress',
            method: 'GET'
        })
        .then( r => {
            
            vnode.state.list = r;
            
            setTimeout( () => vnode.state.getProgress(vnode), 500 );
            
        })
        
    },
    
    oninit: vnode => {
        
        vnode.state.list = [];
        
        vnode.state.getProgress( vnode );
        
    },
    
    view: vnode => {
        
        return [
            m('.buttons',
                m('button', {
                    disabled: recorder.recording,
                    onclick: recorder.record
                }, 'Record'),
                m('button', {
                    disabled: !recorder.recording,
                    onclick: recorder.done
                }, 'Done'),
                m('button', {
                    disabled: !recorder.recording,
                    onclick: recorder.cancel
                }, 'Cancel')
            ),
            m('ol.list', vnode.state.list.map( ( rec, i ) => {
                
                return m('li',
                    {
                    waiting: m('span', 'Waiting...'),
                    done: m('a', { href: rec.data, download: true }, 'Download'),
                    frames: m('span', `Drawing frame ${ rec.data }`),
                    video: m('span', 'Writing video')
                    }[ rec.status ]
                )
                
            }))
        ]
        
    }
}

var container = document.createElement('div');
container.classList.add('recorder');
document.body.appendChild( container );

m.mount( container, UI );

module.exports = recorder;