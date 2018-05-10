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
baltek_tm.utils_tm.Observable_ts = { };

baltek_tm.utils_tm.Observable_ts.__initTestSuite = function(){

    QUnit.module( "Observable_ts" , function(){
        //---------------------------------------------------------------------
        // Define an Observer

        var MyObserver = function(name){
            this.__initObject(name);
        };

        MyObserver.__initClassCalled = false;

        MyObserver.__initClass = function(){

            if ( MyObserver.__initClassCalled ) return;
            MyObserver.__initClassCalled = true;

            baltek.utils.inherit(MyObserver, Object);

            MyObserver.prototype.__initObject = function(name){
                this.name = name;
                this.events = [];
            };

            MyObserver.prototype.updateFromObservable = function(observable, aspect){
                this.events.push( { observable:observable, aspect:aspect } );
            };
        };
        MyObserver.__initClass();
        //---------------------------------------------------------------------
        // Define a test environment

        var __init_testEnvironment = function(){
            var env = {};

            env.observable = new baltek.utils.Observable();
            env.observable.newAspect( "ASPECT-A" );
            env.observable.newAspect( "ASPECT-B" );
            env.ASPECT_A = env.observable.getAspect( "ASPECT-A");
            env.ASPECT_B = env.observable.getAspect( "ASPECT-B");
            env.ASPECT_X;
            env.ASPECT_Y = 999;

            env.observerA1 = new MyObserver( "A1" );
            env.observerA2 = new MyObserver( "A2" );
            env.observerB1 = new MyObserver( "B1" );
            env.observerB2 = new MyObserver( "B2" );
            env.observable.registerObserver(env.observerA1, env.ASPECT_A );
            env.observable.registerObserver(env.observerA2, env.ASPECT_A );
            env.observable.registerObserver(env.observerB1, env.ASPECT_B );
            env.observable.registerObserver(env.observerB2, env.ASPECT_B );

            return env;
        };
        //---------------------------------------------------------------------
        QUnit.test( "__initObject_tc" , function(assert){

            var myObservable = new baltek.utils.Observable();

            assert.deepEqual( baltek.utils.getOwnProperties(myObservable), [ "aspectNames", "observersByAspects"], "ownProperties" );
            assert.deepEqual( myObservable.aspectNames, [], "aspectNames") ;
            assert.deepEqual( myObservable.observersByAspects, [], "observersByAspects") ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "getAspect_tc" , function(assert){

            var myObservable = new baltek.utils.Observable();
            myObservable.newAspect( "ASPECT-A" )
            myObservable.newAspect( "ASPECT-B" )
            myObservable.newAspect( "ASPECT-C" )
            assert.equal( myObservable.getAspect( "ASPECT-A" ), 0, "ASPECT-A") ;
            assert.equal( myObservable.getAspect( "ASPECT-B" ), 1, "ASPECT-A") ;
            assert.equal( myObservable.getAspect( "ASPECT-C" ), 2, "ASPECT-A") ;
            assert.throws( function(){ myObservable.getAspect( "aspect-z" ); }, /^ASSERTION FAILED/, "undefined aspect" ) ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "newAspect_tc" , function(assert){

            var myObservable = new baltek.utils.Observable();
            myObservable.newAspect( "ASPECT-A" );
            myObservable.newAspect( "ASPECT-B" );
            myObservable.newAspect( "ASPECT-C" );
            assert.deepEqual( myObservable.aspectNames, [ "ASPECT-A", "ASPECT-B", "ASPECT-C"], "aspectNames") ;
            assert.throws( function(){ myObservable.newAspect( "ASPECT-A" ); }, /^ASSERTION FAILED/, "already defined aspect" ) ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "notifyObservers_tc" , function(assert){

            var env = __init_testEnvironment();

            env.observable.notifyObservers(env.ASPECT_A);
            assert.deepEqual( env.observerA1.events, [ {observable:env.observable, aspect:env.ASPECT_A} ], "myObserverA1 events after notify ASPECT_A") ;
            assert.deepEqual( env.observerA2.events, [ {observable:env.observable, aspect:env.ASPECT_A} ], "myObserverA2 events after notify ASPECT_A") ;
            assert.deepEqual( env.observerB1.events, [ ], "myObserverB1 events after notify ASPECT_A") ;
            assert.deepEqual( env.observerB2.events, [ ], "myObserverB2 events after notify ASPECT_A") ;

            env.observable.notifyObservers(env.ASPECT_B);
            assert.deepEqual( env.observerA1.events, [ {observable:env.observable, aspect:env.ASPECT_A} ], "myObserverA1 events after notify ASPECT_B") ;
            assert.deepEqual( env.observerA2.events, [ {observable:env.observable, aspect:env.ASPECT_A} ], "myObserverA2 events after notify ASPECT_B") ;
            assert.deepEqual( env.observerB1.events, [ {observable:env.observable, aspect:env.ASPECT_B} ], "myObserverB1 events after notify ASPECT_B") ;
            assert.deepEqual( env.observerB2.events, [ {observable:env.observable, aspect:env.ASPECT_B} ], "myObserverB2 events after notify ASPECT_B") ;

            assert.throws( function(){ env.observable.notifyObservers(env.ASPECT_X); }, /^ASSERTION FAILED/, "undefined aspect" ) ;
            assert.throws( function(){ env.observable.notifyObservers(env.ASPECT_Y); }, /^ASSERTION FAILED/, "wrong aspect" ) ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "registerObserver_tc" , function(assert){

            var env = __init_testEnvironment();
            env.observable.registerObserver(env.observerB2, env.ASPECT_B ); // registering twice must not throw exception

            assert.deepEqual( env.observable.observersByAspects, [ [env.observerA1, env.observerA2], [env.observerB1, env.observerB2] ], "observersByAspects") ;
            assert.throws( function(){ env.observable.registerObserver(env.observerA1, env.ASPECT_X ); }, /^ASSERTION FAILED/, "undefined aspect" ) ;
            assert.throws( function(){ env.observable.registerObserver(env.observerA1, env.ASPECT_Y ); }, /^ASSERTION FAILED/, "wrong aspect" ) ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "unregisterObserver_tc" , function(assert){

            var env = __init_testEnvironment();

            env.observable.unregisterObserver(env.observerA1, env.ASPECT_A );
            assert.deepEqual( env.observable.observersByAspects, [ [env.observerA2], [env.observerB1, env.observerB2] ], "observersByAspects after 1st unregisterObserver") ;
            env.observable.unregisterObserver(env.observerA2, env.ASPECT_A );
            assert.deepEqual( env.observable.observersByAspects, [ [], [env.observerB1, env.observerB2] ], "observersByAspects after 2nd unregisterObserver") ;

            env.observable.unregisterObserver(env.observerB1, env.ASPECT_B );
            env.observable.unregisterObserver(env.observerB1, env.ASPECT_B ); // unregistering twice must not throw exception
            assert.deepEqual( env.observable.observersByAspects, [ [], [env.observerB2] ], "observersByAspects after 3rd unregisterObserver") ;
            env.observable.unregisterObserver(env.observerB2, env.ASPECT_B );
            assert.deepEqual( env.observable.observersByAspects, [ [], [] ], "observersByAspects after 4th unregisterObserver") ;

            assert.throws( function(){ env.observable.unregisterObserver(env.observerA1, env.ASPECT_X ); }, /^ASSERTION FAILED/, "undefined aspect" ) ;
            assert.throws( function(){ env.observable.unregisterObserver(env.observerA1, env.ASPECT_Y ); }, /^ASSERTION FAILED/, "wrong aspect" ) ;
        });
        //---------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
