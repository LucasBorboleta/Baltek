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
