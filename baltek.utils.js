"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.utils = { $initCalled: false };

baltek.utils.$init = function(){
    if ( ! baltek.utils.$initCalled ) {
        baltek.utils.$initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
    }
}

baltek.utils.assert = function(condition, message){
    if ( ! condition ) {

        var text = "ASSERTION FAILED";

        if ( message !== undefined ) {
            text += ": " + message + " !";
        } else {
            text += " !";
        }

        var error = new Error();
        text += "\n\n STACK TRACE: " + error.stack;

        console.log(text);
        baltek.debug.writeMessage(text);
        alert(text);
        throw text;
    }
}

baltek.utils.getOwnProperties = function(anObject){
    var properties = [];
    var aProperty;
    for ( aProperty in anObject ) {
        if ( anObject.hasOwnProperty(aProperty) ) {
            properties.push(aProperty);
        }
    }
    properties.sort();
    return properties;
}

baltek.utils.hasValue = function(array, value){
    baltek.utils.assert( Array.isArray(array) )
    return (array.indexOf(value) > -1);
}

baltek.utils.inherit = function(childConstructor, parentConstructor){

    // Copied from: http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
    // OOP In JavaScript: What You NEED to Know
    // march. 19 2013 215
    // (Object Oriented JavaScript: Only Two Techniques Matter)

    var copyOfParent = Object.create(parentConstructor.prototype);
    copyOfParent.constructor = childConstructor;
    childConstructor.prototype = copyOfParent;

    // Adds the parent as "super" to the childConstructor.
    // Adding "super" to childConstructor.prototype leads to infinite recursion!
    // Using "super" minimizes the occurence of the parentConstructor name
    // in the block of code that defines the child. The unique occurence is
    // in the "inherit(childConstructor, parentConstructor)"
    // statement.
    childConstructor.super = parentConstructor.prototype;
}

baltek.utils.repeatString = function(value, count){
    // Workaround because not support of String.repeat in Internet-Explorer-11
    var text="";
    var i=0;
    for (i=0; i<count; i++) {
        text += value;
    }
    return text;
}
///////////////////////////////////////////////////////////////////////////////
baltek.utils.Observable = function(){
    this.$init();
};

baltek.utils.inherit(baltek.utils.Observable, Object);

baltek.utils.Observable.prototype.$init = function(){
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
///////////////////////////////////////////////////////////////////////////////
