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
baltek.draw.BallWatcher = function(){
    this.__initObject();
};

baltek.draw.BallWatcher.__initClassCalled = false;

baltek.draw.BallWatcher.__initClass = function(){

    if ( baltek.draw.BallWatcher.__initClassCalled ) return;
    baltek.draw.BallWatcher.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.BallWatcher, baltek.utils.Observable);

    baltek.draw.BallWatcher.prototype.__initObject = function(){
        baltek.draw.BallWatcher.super.__initObject.call(this);
        this.ballWatcherAspect = this.newAspect( "ballWatcherAspect" );

        this.ball = null;
    };

    baltek.draw.BallWatcher.prototype.getBall = function(){
        return this.ball;
    };

    baltek.draw.BallWatcher.prototype.registerObserver = function(observer){
        baltek.draw.BallWatcher.super.registerObserver.call(this, observer, this.ballWatcherAspect);
    };

    baltek.draw.BallWatcher.prototype.updateFromObservable = function(observable){
        baltek.utils.assert( observable instanceof baltek.draw.Ball );
        this.ball = observable;
        this.notifyObservers(this.ballWatcherAspect);
    };
};
///////////////////////////////////////////////////////////////////////////////
