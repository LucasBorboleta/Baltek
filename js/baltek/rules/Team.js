"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
        this.goalSquare = null; // the square to be defended by the team
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
    };

    baltek.rules.Team.prototype.enableFootballers = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].selectable = condition;
        }
    };

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
    };

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
    };

    baltek.rules.Team.prototype.initFootballerCapabilities = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].canKick = condition;
            this.footballers[i].canRun = condition;
        }
    };

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
    };

    baltek.rules.Team.prototype.selectFootballers = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].selected = condition;
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
