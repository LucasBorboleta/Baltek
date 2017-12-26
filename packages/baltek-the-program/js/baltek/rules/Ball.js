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
        this.square = null;
    };

    baltek.rules.Ball.prototype.exportMoveState = function(){
        var state = baltek.rules.Ball.super.exportMoveState.call(this);
        state.squareIndices = this.square.getSquareIndices();
        return state;
    };

    baltek.rules.Ball.prototype.getTurnState = function(){
        var state = {};
        state.square = this.square;
        return state;
    };

    baltek.rules.Ball.prototype.setTurnState = function(state){
        state.square.setBall(this);
    };
};
///////////////////////////////////////////////////////////////////////////////
