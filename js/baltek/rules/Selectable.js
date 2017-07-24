"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Selectable = function(){
    this.__initObject();
};

baltek.rules.Selectable.__initClassCalled = false;

baltek.rules.Selectable.__initClass = function(){

    if ( baltek.rules.Selectable.__initClassCalled ) return;
    baltek.rules.Selectable.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Selectable, Object);

    baltek.rules.Selectable.prototype.__initObject = function(){
        this.selected = false;
        this.selectable = false;
        this.cost = 0;
    };

    baltek.rules.Selectable.prototype.exportState = function(){
        var state = {};
        state.selected = this.selected;
        state.selectable = this.selectable;
        state.cost = this.cost;
        return state;
    };
};
///////////////////////////////////////////////////////////////////////////////
