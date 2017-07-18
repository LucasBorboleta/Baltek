"use strict";
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
    }

    baltek.draw.FootballerWatcher.prototype.getFootballer = function(){
        return this.footballer;
    }

    baltek.draw.FootballerWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Footballer
        this.footballer = observable;
        this.notifyObservers();
    }
}
///////////////////////////////////////////////////////////////////////////////
