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
baltek_test.js_learning_test = { };
baltek_test.js_learning_test.__initModuleCalled = false;

baltek_test.js_learning_test.__initModule = function(){

    if ( baltek_test.js_learning_test.__initModuleCalled ) return;
    baltek_test.js_learning_test.__initModuleCalled = true;

    QUnit.module( "js_learning_test" , function(){
        //---------------------------------------------------------------------
        QUnit.test( "testPropertiesAndBracketNotation" , function( assert ) {
            var a = { p1: "p1-value-0" };
            assert.equal( a.p1, "p1-value-0", "getting using dot" );
            assert.equal( a[ "p1" ], "p1-value-0", "getting using brackets" );

            a.p1 = "p1-value-1";
            assert.equal( a.p1, "p1-value-1", "setting using dot" );
            a[ "p1" ] = "p1-value-2";
            assert.equal( a.p1, "p1-value-2", "setting using brackets" );

            a[ "p2" ] = "p2-value-0";
            assert.equal( a.p2, "p2-value-0", "creating using brackets" );

            var aProperties = [];
            var p;
            for (p in a) {
                if ( a.hasOwnProperty(p) ) {
                    aProperties.push(p);
                }
            }
            aProperties.sort();
            assert.deepEqual( aProperties, [ "p1" , "p2" ], "properties of 'a'" );
        });
        //---------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
