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
QUnit.module( "LaboTest" , function(){

    QUnit.module( "AnimalTest" , function(){
        QUnit.test( "testNewAndInheritage" , function(assert){
            assert.expect( 6 );

            var a1 = new Labo.Animal( "a1" );
            var a2 = new Labo.Animal( "a2" );
            var a3 = new Labo.Animal( "a3" );

            assert.equal(a1.cry(), "Labo.Animal: 'a1' cries something!" , "cry() by a1" );
            assert.equal(a2.cry(), "Labo.Animal: 'a2' cries something!" , "cry() by a2" );
            assert.equal(a3.cry(), "Labo.Animal: 'a3' cries something!" , "cry() by a3" );

            assert.equal( typeof a1, "object", "typeof a1" );
            assert.ok( a1 instanceof Labo.Animal, "a1 intanceof Labo.Animal" );
            assert.ok( "fooAnimal" in a1, "d1 has property fooAnimal" );
        });
    });

    QUnit.module( "DogTest" , function() {
        QUnit.test( "testNewAndInheritage" , function( assert ) {
            var d1 = new Labo.Dog( "d1" , "red" );
            var d2 = new Labo.Dog( "d2" , "blue" );
            assert.equal(d1.cry(), "Labo.Dog: 'd1', whose color is 'red', cries whoua!" , "cry() by d1" );
            assert.equal(d2.cry(), "Labo.Dog: 'd2', whose color is 'blue', cries whoua!" , "cry() by d2"  );
            assert.equal( typeof d1, "object", "typeof a1" );
            assert.ok( d1 instanceof Labo.Dog, "d1 intanceof Labo.Dog" );
            assert.ok( d1 instanceof Labo.Animal, "d1 intanceof Labo.Animal" );
            assert.ok( "fooDog" in d1, "d1 has property fooDog" );
        });
    });
    QUnit.module( "BigDogTest" , function() {
        QUnit.test( "testNewAndInheritage" , function( assert ) {
            var bd1 = new Labo.BigDog( "bd1" , "green" , "1.10" );
            var bd2 = new Labo.BigDog( "bd2" , "orange" , "2.20" );
            assert.equal( bd1.cry(),
                "Labo.Dog: 'bd1', whose color and size are 'green' and '1.10', cries whoua whoua!" , "cry() by bd1" );
            assert.equal( bd2.cry(),
                "Labo.Dog: 'bd2', whose color and size are 'orange' and '2.20', cries whoua whoua!" , "cry() by bd2" );
            assert.equal( typeof bd1, "object", "typeof a1" );
            assert.ok( bd1 instanceof Labo.BigDog, "bd1 intanceof Labo.BigDog" );
            assert.ok( bd1 instanceof Labo.Dog, "bd1 intanceof Labo.Dog" );
            assert.ok( bd1 instanceof Labo.Animal, "bd1 intanceof Labo.Animal" );
            assert.ok( "fooBigDog" in bd1, "bd1 has property fooBigDog" );
        });
    });

    QUnit.module( "Utils" , function() {
        QUnit.test( "testInArray" , function( assert ) {
            var languages = ["en","eo","fr","pt"];
            assert.ok( Labo.inArray("en",languages), "en in languages");
            assert.notOk( Labo.inArray("nuu",languages), "nuu not in languages");

            var foo = null;
            assert.notOk( Labo.inArray(foo,languages), "foo not in languages");

        });
    });

    QUnit.module( "Properties" , function() {
        QUnit.test( "testBrackets" , function( assert ) {
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
            assert.deepEqual( aProperties, [ "p1" , "p2" ], "properties of a" );

        });
    });

});
///////////////////////////////////////////////////////////////////////////////
Labo.assert( 1+1 === 3 , "test of labo.assert" )
///////////////////////////////////////////////////////////////////////////////
jQuery(document).ready(function(){
    Labo.writeDebugText( "LaboTest.js: Loaded." );
});
///////////////////////////////////////////////////////////////////////////////
