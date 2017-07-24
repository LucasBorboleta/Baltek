"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.BoxWatcher = function(){
    this.__initObject();
};

baltek.draw.BoxWatcher.__initClassCalled = false;

baltek.draw.BoxWatcher.__initClass = function(){

    if ( baltek.draw.BoxWatcher.__initClassCalled ) return;
    baltek.draw.BoxWatcher.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.BoxWatcher, baltek.utils.Observable);

    baltek.draw.BoxWatcher.prototype.__initObject = function(){
        baltek.draw.BoxWatcher.super.__initObject.call(this);
        this.boxWatcherAspect = this.newAspect("boxWatcherAspect");

        this.box = null;
    };

    baltek.draw.BoxWatcher.prototype.getBox = function(){
        return this.box;
    };

    baltek.draw.BoxWatcher.prototype.updateFromObservable = function(observable){
        // The observable is assumed of type baltek.draw.Box
        this.box = observable;
        this.notifyObservers();
    };
};
///////////////////////////////////////////////////////////////////////////////
