"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Ball = function(){
    this.__initObject();
};

baltek.rules.Ball.__initClassCalled = false;

baltek.rules.Ball.__initClass = function(){

    if ( baltek.rules.Ball.__initClassCalled ) return;
    baltek.rules.Ball.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Ball, Object);

    baltek.rules.Ball.prototype.__initObject = function(){
        this.box = null;
    }

    baltek.rules.Ball.prototype.exportState = function(){
        var state = {};
        state.boxIndices = this.box.getBoxIndices();
        return state;
    }

    baltek.rules.Ball.prototype.importState = function(state, field){
        var box = field.boxesByIndices[state.boxIndices.ix][state.boxIndices.iy];
        box.setBall(this);
    }

    baltek.rules.Ball.prototype.getState = function(){
        var state = {};
        state.box = this.box;
        return state;
    }

    baltek.rules.Ball.prototype.setState = function(state){
        state.box.setBall(this);
    }
}
///////////////////////////////////////////////////////////////////////////////
