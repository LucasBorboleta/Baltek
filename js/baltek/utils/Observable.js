"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.utils.Observable = function(){
    this.__initObject();
};

baltek.utils.Observable.__initClassCalled = false;

baltek.utils.Observable.__initClass = function(){

    if ( baltek.utils.Observable.__initClassCalled ) return;
    baltek.utils.Observable.__initClassCalled = true;

    baltek.utils.inherit(baltek.utils.Observable, Object);

    baltek.utils.Observable.prototype.__initObject = function(){
        this.aspectNames = [];
        this.observersByAspects = [];
    }

    baltek.utils.Observable.prototype.getAspect = function(aspectName){
        var aspect = this.aspectNames.indexOf(aspectName);
        baltek.utils.assert( aspect > -1 );
        return aspect;
    }

    baltek.utils.Observable.prototype.newAspect = function(aspectName){
        baltek.utils.assert( ! baltek.utils.hasValue(this.aspectNames, aspectName) );
        this.aspectNames.push(aspectName);
        this.observersByAspects.push( [] );
        var aspect = this.aspectNames.length - 1;
        return aspect;
    }

    baltek.utils.Observable.prototype.notifyObservers = function(aspect){
        if ( aspect === undefined ) { aspect = 0;
        }
        baltek.utils.assert( aspect < this.aspectNames.length );
        var observers = this.observersByAspects[aspect];
        var n = observers.length;
        var i = 0;
        for ( i=0; i < n ; i++ ) {
            observers[i].updateFromObservable(this, aspect);
        }
    }

    baltek.utils.Observable.prototype.registerObserver = function(observer, aspect){
        if ( aspect === undefined ) {
            aspect = 0;
        }
        baltek.utils.assert( aspect < this.aspectNames.length );
        var observerIndex = this.observersByAspects[aspect].indexOf(observer);
        if ( ! ( observerIndex > -1 ) ) {
            this.observersByAspects[aspect].push(observer);
        }
    }

    baltek.utils.Observable.prototype.unregisterObserver = function(observer, aspect){
        if ( aspect === undefined ) {
            aspect = 0;
        }
        baltek.utils.assert( aspect < this.aspectNames.length );
        var observerIndex = this.observersByAspects[aspect].indexOf(observer);
        if ( observerIndex > -1 ) {
            this.observersByAspects[aspect].splice(observerIndex, 1);
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
