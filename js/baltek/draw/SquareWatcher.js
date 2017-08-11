"use strict";
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

    baltek.draw.SquareWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Square
        this.square = observable;
        this.notifyObservers();
    };
};
///////////////////////////////////////////////////////////////////////////////
