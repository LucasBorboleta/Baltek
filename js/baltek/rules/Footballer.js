"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Footballer = function(team, force){
    this.__initObject(team, force);
};

baltek.rules.Footballer.__initClassCalled = false;

baltek.rules.Footballer.__initClass = function(){

    if ( baltek.rules.Footballer.__initClassCalled ) return;
    baltek.rules.Footballer.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Footballer, baltek.rules.Selectable);

    baltek.rules.Footballer.prototype.__initObject = function(team, force){
        baltek.rules.Footballer.super.__initObject.call(this);
        this.team = team;
        this.force = force;
        this.box = null;
        this.canKick = false;
        this.canRun = false;
    };

    baltek.rules.Footballer.prototype.exportState = function(){
        var state = baltek.rules.Footballer.super.exportState.call(this);
        state.boxIndices = this.box.getBoxIndices();
        state.canKick = this.canKick;
        state.canRun = this.canRun;
        return state;
    };

    baltek.rules.Footballer.prototype.getState = function(){
        var state = {};
        state.box = this.box;
        state.canKick = this.canKick;
        state.canRun = this.canRun;
        return state;
    };

    baltek.rules.Footballer.prototype.setState = function(state){
        state.box.setFootballer(this);
        this.canKick = state.canKick;
        this.canRun = state.canRun;
    };
};
///////////////////////////////////////////////////////////////////////////////
