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
        this.square = null;
        this.canKick = false;
        this.canRun = false;
    };

    baltek.rules.Footballer.prototype.exportState = function(){
        var state = baltek.rules.Footballer.super.exportState.call(this);
        state.squareIndices = this.square.getSquareIndices();
        state.canKick = this.canKick;
        state.canRun = this.canRun;
        return state;
    };

    baltek.rules.Footballer.prototype.getState = function(){
        var state = {};
        state.square = this.square;
        state.canKick = this.canKick;
        state.canRun = this.canRun;
        return state;
    };

    baltek.rules.Footballer.prototype.setState = function(state){
        state.square.setFootballer(this);
        this.canKick = state.canKick;
        this.canRun = state.canRun;
    };
};
///////////////////////////////////////////////////////////////////////////////
