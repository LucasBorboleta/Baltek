"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Footballer = function(team, force){
    this.__initObject(team, force);
};

baltek.rules.Footballer.__initClassCalled = false;

baltek.rules.Footballer.__initClass = function(){

    if ( baltek.rules.Footballer.__initClassCalled ) return;
    baltek.rules.Footballer.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Footballer, Object);

    baltek.rules.Footballer.prototype.__initObject = function(team, force){
        this.team = team;
        this.force = force;
        this.box = null;
        this.canKick = false;
        this.canRun = false;
    }
}
///////////////////////////////////////////////////////////////////////////////
