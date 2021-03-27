"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
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
        this.sprintCount = 0;
        this.haveGoaled = false;
        this.credit = 0;

        // Populate the team
        this.footballer3FrontCenter = new baltek.rules.Footballer(this, 3);
        this.footballer2FrontLeft = new baltek.rules.Footballer(this, 2);
        this.footballer2FrontRight = new baltek.rules.Footballer(this, 2);

        this.footballer1InterLeft = new baltek.rules.Footballer(this, 1);
        this.footballer1InterCenter = new baltek.rules.Footballer(this, 1);
        this.footballer1InterRight = new baltek.rules.Footballer(this, 1);

        this.footballer3BackCenter = new baltek.rules.Footballer(this, 3);
        this.footballer2BackLeft = new baltek.rules.Footballer(this, 2);
        this.footballer2BackRight = new baltek.rules.Footballer(this, 2);

        this.footballers = [];
        this.footballers.push(this.footballer3FrontCenter);
        this.footballers.push(this.footballer2FrontLeft);
        this.footballers.push(this.footballer2FrontRight);

        this.footballers.push(this.footballer1InterLeft);
        this.footballers.push(this.footballer1InterCenter);
        this.footballers.push(this.footballer1InterRight);

        this.footballers.push(this.footballer3BackCenter);
        this.footballers.push(this.footballer2BackLeft);
        this.footballers.push(this.footballer2BackRight);
    };

    baltek.rules.Team.prototype.enableCapabilities = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].enableCapabilities(condition);
        }
    };

    baltek.rules.Team.prototype.enableSelection = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].enableSelection(condition);
        }
    };

    baltek.rules.Team.prototype.exportMoveState = function(){
        var state = {};
        state.teamIndex = this.teamIndex ;
        state.score = this.score;
        state.sprintCount = this.sprintCount;
        state.haveGoaled = this.haveGoaled;
        state.credit = this.credit;
        state.footballers = [];
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            state.footballers[i] = this.footballers[i].exportMoveState();
        }
        return state;
    };

    baltek.rules.Team.prototype.getTurnState = function(){
        var state = {};
        state.score = this.score;
        state.sprintCount = this.sprintCount;
        state.haveGoaled = this.haveGoaled;
        state.credit = this.credit;
        state.footballers = [];
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            state.footballers[i] = this.footballers[i].getTurnState();
        }
        return state;
    };

    baltek.rules.Team.prototype.select = function(condition){
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].select(condition);
        }
    };

    baltek.rules.Team.prototype.setTurnState = function(state){
        this.score = state.score ;
        this.sprintCount = state.sprintCount;
        this.haveGoaled = state.haveGoaled;
        this.credit = state.credit;
        var i = 0;
        var n = this.footballers.length;
        for ( i=0; i<n; i++ ) {
            this.footballers[i].setTurnState(state.footballers[i]);
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
