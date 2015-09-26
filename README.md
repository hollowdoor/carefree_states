carefree-states
===============

Install
-------

`npm install carefree-states`

Usage
-----

States must be objects with an `exec`, and `destroy` method.

`exec` methods must return a promise.

You can also pass a promise to the second argument of `exec`.

```javascript
var createStates = require('carefree-states'),
    states = createStates();

var state1 = {
    exec: function(value){
        return new Promise(function(resolve, reject){
            resolve('1 '+ value);
        });
    },
    destroy: function(){
        this.exec = function(){
            return Promise.resolve(undefined);
        };
    }
};

var state2 = {
    exec: function(value){
        return new Promise(function(resolve, reject){
            resolve('2 '+ value+'s');
        });
    },
    destroy: function(){
        this.exec = function(){
            return Promise.resolve(undefined);
        };
    }
};

var state3 = {
    exec: function(value){
        return new Promise(function(resolve, reject){
            resolve('3 '+ value+'s');
        });
    },
    destroy: function(){
        this.exec = function(){
            return Promise.resolve(undefined);
        };
    }
};

states.on('exec', function(value){
    console.log('exec says there are '+value);
});

states.on('error', function(e){
    console.log(e);
});

states.add('one', state1);//prints 1 cat
states.add(/^two/, state2);
states.exec('one', 'cat');
states.exec('two more', 'cat');

states.remove('one').add('one', state3);
states.exec('one', 'cat');//prints 3 cats
states.exec('two more', 'cat').then(function(value){
    //value = '2 cats'
});
states.destroy(/^two/); //That state no longer works.
```

About
-----

This module manages states.

It's a slightly easier state machine like mechanism without the restrictions of traditional state machines.
