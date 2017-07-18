"use strict";
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
        this.ballWatcherAspect = this.newAspect("ballWatcherAspect");

        this.ball = null;
    }

    baltek.draw.BallWatcher.prototype.getBall = function(){
        return this.ball;
    }

    baltek.draw.BallWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Ball
        this.ball = observable;
        this.notifyObservers();
    }
}
///////////////////////////////////////////////////////////////////////////////
