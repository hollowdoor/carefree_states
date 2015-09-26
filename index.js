var Emitter = require('more-events').Emitter;
/*
git remote add origin https://github.com/hollowdoor/carefree_states.git
git push -u origin master
*/
function State(){
    this.shells = [];
    this.events = new Emitter();
}

State.prototype.on = function(event, cb){
    this.events.on(event, cb);
};

State.prototype.add = function(id, shell){
    var name = String(id);
    if(!(id instanceof RegExp))
        id = new RegExp('^'+escapeRegExp(id)+'$');

    this.shells.push({
        id: id,
        name: name,
        shell: shell
    });
    return this;
};
State.prototype.exec = function(id, obj){
    var self = this;//, shells = this.shells, events = this.events;


    return new Promise(function(resolve, reject){
        var result;
        function onResolve(value){
            self.events.emit('exec', value, obj);
            resolve(value);
        }
        function onReject(e){
            self.events.emit('error', e);
            reject(e);
        }

        for(var i=0; i<self.shells.length; i++){
            if(self.shells[i].id.test(id)){


                if(typeof obj.then === 'function'){

                    obj.then(function(value){
                        result = self.shells[i].shell.exec.call(self, value);
                        result.then(onResolve, onReject);
                    }, onReject);
                }else{
                    result = self.shells[i].shell.exec.call(self, obj);
                    result.then(onResolve, onReject);
                }
                return;
            }

        }

        resolve(undefined);
    });
};

State.prototype.remove = function(id){
    //This is a form of delegation.
    //Objects are not destroyed.
    for(var i=0; i<this.shells.length; i++){
        if(String(this.shells[i].name) === String(id)){
            this.shells.splice(i, 1);
            return this;
        }
    }
    return this;
};

State.prototype.destroy = function(id){
    for(var i=0; i<this.shells.length; i++){
        if(String(this.shells[i].name) === String(id)){
            this.shells.splice(i, 1)[0].shell.destroy();
            return this;
        }
    }
    return this;
};

module.exports = function(){
    return new State();
};

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
