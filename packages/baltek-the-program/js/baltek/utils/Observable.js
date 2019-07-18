"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
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
        // An observable can be observed along one or many apsects.
        this.aspectNames = [];
        // The observers are subscribing the observable for a given aspect.
        this.observersByAspects = [];
    };

    baltek.utils.Observable.prototype.getAspect = function(aspectName){
        var aspect = this.aspectNames.indexOf(aspectName);
        baltek.utils.assert( aspect > -1 );
        return aspect;
    };

    baltek.utils.Observable.prototype.newAspect = function(aspectName){
        baltek.utils.assert( ! baltek.utils.hasValue(this.aspectNames, aspectName) );
        this.aspectNames.push(aspectName);
        this.observersByAspects.push( [] );
        var aspect = this.aspectNames.length - 1;
        return aspect;
    };

    baltek.utils.Observable.prototype.notifyObservers = function(aspect){
        baltek.utils.assert( aspect !== undefined );
        baltek.utils.assert( aspect < this.aspectNames.length );

        var observers = this.observersByAspects[aspect];
        var n = observers.length;
        var i = 0;
        var thisSaved = this;
        var notifier;

        if ( baltek.useDispatcher ) {

            baltek.utils.Dispatcher.getInstance().lock();
            for ( i=0; i < n ; i++ ) {

                notifier = function(){
                    var observerSaved = observers[i];
                    return function(){
                        baltek.debug.writeMessage( "Dispatcher: updateFromObservable for apsect=" + thisSaved.aspectNames[aspect] );
                        observerSaved.updateFromObservable(thisSaved, aspect); };
                }();

                baltek.utils.Dispatcher.getInstance().registerNotifier(notifier);
            }
            baltek.utils.Dispatcher.getInstance().unlock();

        } else {
            for ( i=0; i < n ; i++ ) {
                observers[i].updateFromObservable(thisSaved, aspect);
            }
        }
    };

    baltek.utils.Observable.prototype.registerObserver = function(observer, aspect){
        baltek.utils.assert( aspect !== undefined );
        baltek.utils.assert( aspect < this.aspectNames.length );
        var observerIndex = this.observersByAspects[aspect].indexOf(observer);
        if ( ! ( observerIndex > -1 ) ) {
            this.observersByAspects[aspect].push(observer);
        }
    };

    baltek.utils.Observable.prototype.unregisterObserver = function(observer, aspect){
        baltek.utils.assert( aspect !== undefined );
        baltek.utils.assert( aspect < this.aspectNames.length );
        var observerIndex = this.observersByAspects[aspect].indexOf(observer);
        if ( observerIndex > -1 ) {
            this.observersByAspects[aspect].splice(observerIndex, 1);
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
