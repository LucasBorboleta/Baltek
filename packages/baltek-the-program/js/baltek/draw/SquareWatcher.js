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
baltek.draw.SquareWatcher = function(){
    this.__initObject();
};

baltek.draw.SquareWatcher.__initClassCalled = false;

baltek.draw.SquareWatcher.__initClass = function(){

    if ( baltek.draw.SquareWatcher.__initClassCalled ) return;
    baltek.draw.SquareWatcher.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.SquareWatcher, baltek.utils.Observable);

    baltek.draw.SquareWatcher.prototype.__initObject = function(){
        baltek.draw.SquareWatcher.super.__initObject.call(this);
        this.squareWatcherAspect = this.newAspect("squareWatcherAspect");

        this.square = null;
    };

    baltek.draw.SquareWatcher.prototype.getSquare = function(){
        return this.square;
    };

    baltek.draw.SquareWatcher.prototype.registerObserver = function(observer){
        baltek.draw.SquareWatcher.super.registerObserver.call(this, observer, this.squareWatcherAspect);
    };

    baltek.draw.SquareWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Square
        this.square = observable;
        this.notifyObservers(this.squareWatcherAspect);
    };
};
///////////////////////////////////////////////////////////////////////////////
