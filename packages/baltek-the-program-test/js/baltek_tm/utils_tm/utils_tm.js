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
baltek_tm.utils_tm = { };

baltek_tm.utils_tm.__initTestModule = function(){

    QUnit.module( "utils_tm" , function(){
        //-------------------------------------------------------------------------
        baltek_tm.utils_tm.inherit_ts.__initTestSuite();
        baltek_tm.utils_tm.Observable_ts.__initTestSuite();
        //-------------------------------------------------------------------------
        QUnit.test( "assert_tc" , function( assert ) {
            assert.throws( function() { baltek.utils.assert( 1 + 1 == 3, "wrong arithmetic"); }, /ASSERTION FAILED: wrong arithmetic !/ );
        });
        //-------------------------------------------------------------------------
        QUnit.test( "getOwnProperties_tc" , function( assert ) {
            var a = {};
            a.p3 = "p3-value" ;
            a.p2 = "p2-value";
            a.p1 = "p1-value";
            assert.deepEqual( baltek.utils.getOwnProperties(a), [ "p1", "p2", "p3" ], "3 properties" );

            var b = {};
            assert.deepEqual( baltek.utils.getOwnProperties(b), [], "0 property" );
        });
        //-------------------------------------------------------------------------
        QUnit.test( "hasValue_tc" , function( assert ) {
            var languages = [ "en", "eo", "fr", "pt" ];
            assert.ok( baltek.utils.hasValue( languages, "en" ), "en in languages");
            assert.notOk( baltek.utils.hasValue( languages, "nuu"), "nuu not in languages");

            var foo = null;
            assert.notOk( baltek.utils.hasValue(languages, foo), "foo not in languages");
        });
        //-------------------------------------------------------------------------
        QUnit.test( "repeatString_tc" , function( assert ) {
            assert.equal( baltek.utils.repeatString( "XyZ", 0), "", "count=0" );
            assert.equal( baltek.utils.repeatString( "XyZ", 1), "XyZ", "count=1" );
            assert.equal( baltek.utils.repeatString( "XyZ", 2), "XyZXyZ", "count=2" );
            assert.equal( baltek.utils.repeatString( "XyZ", 3), "XyZXyZXyZ", "count=3" );
            assert.equal( baltek.utils.repeatString( "", 3), "", "void string" );
        });
        //-------------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
