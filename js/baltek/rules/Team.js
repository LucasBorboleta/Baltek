"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Team = function(teamIndex){
    this.__initObject(teamIndex);
};

baltek.rules.Team.__initClassCalled = false;

baltek.rules.Team.__initClass = function(){

    if ( baltek.rules.Team.__initClassCalled ) return;
    baltek.rules.Team.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Team, Object);

    baltek.rules.Team.prototype.__initObject = function(teamIndex){
        this.teamIndex = teamIndex ;
        this.goalBox = null; // the box to be defended by the team
        this.score = 0;
        this.canSprint = false;
        this.haveGoaled = false;
        this.credit = 0;

        // Populate the team
        this.footballer3 = new baltek.rules.Footballer(this, 3);  // captain
        this.footballer2t = new baltek.rules.Footballer(this, 2); // @ top
        this.footballer2b = new baltek.rules.Footballer(this, 2); // @ bottom
        this.footballer1t = new baltek.rules.Footballer(this, 1); // @ top
        this.footballer1m = new baltek.rules.Footballer(this, 1); // @ middle
        this.footballer1b = new baltek.rules.Footballer(this, 1); // @ bottom

        this.footballers = [];
        this.footballers.push(this.footballer3);
        this.footballers.push(this.footballer2t);
        this.footballers.push(this.footballer2b);
        this.footballers.push(this.footballer1t);
        this.footballers.push(this.footballer1m);
        this.footballers.push(this.footballer1b);
    }

    baltek.rules.Team.prototype.initFootballerCapabilities = function(){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].canKick = true;
            this.footballers[i].canRun = true;
        }
    }

    baltek.rules.Team.prototype.exportState = function(){
        var state = {};
        state.teamIndex = this.teamIndex ;
        state.score = this.score;
        state.canSprint = this.canSprint;
        state.haveGoaled = this.haveGoaled;
        state.credit = this.credit;
        state.footballers = [];
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            state.footballers[i] = this.footballers[i].exportState();
        }
        return state;
    }

    baltek.rules.Team.prototype.importState = function(state, field){
        baltek.utils.assert( this.teamIndex === state.teamIndex );
        this.score = state.score ;
        this.canSprint = state.canSprint;
        this.haveGoaled = state.haveGoaled;
        this.credit = state.credit;
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].importState(state.footballers[i], field);
        }
    }

    baltek.rules.Team.prototype.getState = function(){
        var state = {};
        state.score = this.score;
        state.canSprint = this.canSprint;
        state.haveGoaled = this.haveGoaled;
        state.credit = this.credit;
        state.footballers = [];
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            state.footballers[i] = this.footballers[i].getState();
        }
        return state;
    }

    baltek.rules.Team.prototype.setState = function(state){
        this.score = state.score ;
        this.canSprint = state.canSprint;
        this.haveGoaled = state.haveGoaled;
        this.credit = state.credit;
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].setState(state.footballers[i]);
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
