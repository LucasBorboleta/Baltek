"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Ball = function(){
    this.__initObject();
};

baltek.rules.Ball.__initClassCalled = false;

baltek.rules.Ball.__initClass = function(){

    if ( baltek.rules.Ball.__initClassCalled ) return;
    baltek.rules.Ball.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Ball, baltek.rules.Selectable);

    baltek.rules.Ball.prototype.__initObject = function(){
        baltek.rules.Ball.super.__initObject.call(this);
        this.box = null;
    }

    baltek.rules.Ball.prototype.exportState = function(){
        var state = baltek.rules.Ball.super.exportState.call(this);
        state.boxIndices = this.box.getBoxIndices();
        return state;
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
