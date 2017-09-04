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
baltek.draw.FootballerWatcher = function(){
    this.__initObject();
};

baltek.draw.FootballerWatcher.__initClassCalled = false;

baltek.draw.FootballerWatcher.__initClass = function(){

    if ( baltek.draw.FootballerWatcher.__initClassCalled ) return;
    baltek.draw.FootballerWatcher.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.FootballerWatcher, baltek.utils.Observable);

    baltek.draw.FootballerWatcher.prototype.__initObject = function(){
        baltek.draw.FootballerWatcher.super.__initObject.call(this);
        this.footballerWatcher = this.newAspect("footballerWatcher");

        this.footballer = null;
    };

    baltek.draw.FootballerWatcher.prototype.getFootballer = function(){
        return this.footballer;
    };

    baltek.draw.FootballerWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Footballer
        this.footballer = observable;
        this.notifyObservers();
    };
};
///////////////////////////////////////////////////////////////////////////////
