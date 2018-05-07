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
baltek_test.utils_test = { };
baltek_test.utils_test.__initModuleCalled = false;

baltek_test.utils_test.__initModule = function(){

    if ( baltek_test.utils_test.__initModuleCalled ) return;
    baltek_test.utils_test.__initModuleCalled = true;

    QUnit.module( "utils_test" , function(){
        //-------------------------------------------------------------------------
        baltek_test.utils_test.inherit_test.__initModule();
        //-------------------------------------------------------------------------
        QUnit.test( "testHasValue" , function( assert ) {
            var languages = [ "en", "eo", "fr", "pt" ];
            assert.ok( baltek.utils.hasValue( languages, "en" ), "en in languages");
            assert.notOk( baltek.utils.hasValue( languages, "nuu"), "nuu not in languages");

            var foo = null;
            assert.notOk( baltek.utils.hasValue(languages, foo), "foo not in languages");
        });
        //-------------------------------------------------------------------------
        QUnit.test( "testRepeatString" , function( assert ) {
            assert.equal( baltek.utils.repeatString( "XyZ", 0), "", "count=0" );
            assert.equal( baltek.utils.repeatString( "XyZ", 1), "XyZ", "count=1" );
            assert.equal( baltek.utils.repeatString( "XyZ", 2), "XyZXyZ", "count=2" );
            assert.equal( baltek.utils.repeatString( "XyZ", 3), "XyZXyZXyZ", "count=3" );
            assert.equal( baltek.utils.repeatString( "", 3), "", "void string" );
        });
        //-------------------------------------------------------------------------
        QUnit.test( "testAssert" , function( assert ) {
            assert.throws( function() { baltek.utils.assert( 1 + 1 == 3, "wrong arithmetic"); }, /ASSERTION FAILED: wrong arithmetic !/ );
        });
        //-------------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
