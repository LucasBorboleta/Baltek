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
        QUnit.test( "__initObject_tc" , function(assert){

            var anObservable = new baltek.utils.Observable();

            assert.deepEqual( baltek.utils.getOwnProperties(anObservable), [ "aspectNames", "observersByAspects"], "ownProperties" );
            assert.deepEqual( anObservable.aspectNames, [], "aspectNames") ;
            assert.deepEqual( anObservable.observersByAspects, [], "observersByAspects") ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "getAspect_tc" , function(assert){

            var anObservable = new baltek.utils.Observable();
            anObservable.newAspect( "aspect-a" )
            anObservable.newAspect( "aspect-b" )
            anObservable.newAspect( "aspect-c" )
            assert.equal( anObservable.getAspect( "aspect-a" ), 0, "aspect-a") ;
            assert.equal( anObservable.getAspect( "aspect-b" ), 1, "aspect-a") ;
            assert.equal( anObservable.getAspect( "aspect-c" ), 2, "aspect-a") ;
            assert.throws( function() { anObservable.getAspect( "aspect-z" ); }, "undefined aspect" ) ;
        });
        //---------------------------------------------------------------------
        QUnit.test( "newAspect_tc" , function(assert){

            var anObservable = new baltek.utils.Observable();
            anObservable.newAspect( "aspect-a" )
            anObservable.newAspect( "aspect-b" )
            anObservable.newAspect( "aspect-c" )
            assert.deepEqual( anObservable.aspectNames, [ "aspect-a", "aspect-b", "aspect-c"], "aspectNames") ;
            assert.throws( function() { anObservable.newAspect( "aspect-a" ); }, "already defined aspect" ) ;
        });
        //---------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
