"use strict";
/*
BALTEK (the program) implements BALTEK (the ia), a turn-based board game, inspired from football.
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
baltek.ia.IA = function(){
    this.__initObject();
};

baltek.ia.IA.__initClassCalled = false;

baltek.ia.IA.__initClass = function(){

    if ( baltek.ia.IA.__initClassCalled ) return;
    baltek.ia.IA.__initClassCalled = true;

    baltek.utils.inherit(baltek.ia.IA, Object);

    baltek.ia.IA.prototype.__initObject = function(){
        this.xxx = false;

    };

    baltek.ia.IA.prototype.zzz = function(condition){
        this.xxx = condition;
    };
};
///////////////////////////////////////////////////////////////////////////////
