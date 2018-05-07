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
baltek_test.utils_test.inherit_test = { };
baltek_test.utils_test.inherit_test.__initModuleCalled = false;

baltek_test.utils_test.inherit_test.__initModule = function(){

    if ( baltek_test.utils_test.inherit_test.__initModuleCalled ) return;
    baltek_test.utils_test.inherit_test.__initModuleCalled = true;

    QUnit.module( "inherit_test" , function(){
        //---------------------------------------------------------------------
        // 1) Define 3 classes with inheritance.
        //---------------------------------------------------------------------
        var Labo = {};
        //---------------------------------------------------------------------
        Labo.Animal = function(name){
            this.__initObject(name);
        }

        Labo.Animal.__initClassCalled = false;

        Labo.Animal.__initClass = function(){

            if ( Labo.Animal.__initClassCalled ) return;
            Labo.Animal.__initClassCalled = true;

            baltek.utils.inherit(Labo.Animal, Object);

            Labo.Animal.prototype.__initObject = function(name){
                this.name = name;
            }

            Labo.Animal.prototype.cry = function(){
                var text = "Labo.Animal: '" + this.name + "' cries something!" ;
                baltek.debug.writeMessage(text);
                return text;
            }
            Labo.Animal.prototype.fooAnimal = function(){
            }
        }
        //---------------------------------------------------------------------
        Labo.Dog = function(name, color){
            this.__initObject(name, color);
        }

        Labo.Dog.__initClassCalled = false;

        Labo.Dog.__initClass = function(){

            if ( Labo.Dog.__initClassCalled ) return;
            Labo.Dog.__initClassCalled = true;

            baltek.utils.inherit(Labo.Dog, Labo.Animal);

            Labo.Dog.prototype.__initObject = function(name, color){
                Labo.Dog.super.__initObject.call(this, name);
                this.color = color;
            }

            Labo.Dog.prototype.cry = function(){
                var text = "Labo.Dog: '" + this.name + "', whose color is '" + this.color +
                           "', cries whoua!" ;
                baltek.debug.writeMessage(text);
                return text;
            }

            Labo.Dog.prototype.fooDog = function(){
            }
        }
        //---------------------------------------------------------------------
        Labo.BigDog = function(name, color, size){
            this.__initObject(name, color, size);
        }

        Labo.BigDog.__initClassCalled = false;

        Labo.BigDog.__initClass = function(){

            if ( Labo.BigDog.__initClassCalled ) return;
            Labo.BigDog.__initClassCalled = true;

            baltek.utils.inherit(Labo.BigDog, Labo.Dog);

            Labo.BigDog.prototype.__initObject = function(name, color, size){
               Labo.BigDog.super.__initObject.call(this,name,color);
               this.size = size;
            }

            Labo.BigDog.prototype.cry = function(){
               var text = "Labo.Dog: '" + this.name + "', whose color and size are '" +
                          this.color + "' and '" + this.size + "', cries whoua whoua!";
               baltek.debug.writeMessage(text);
               return text;
            }

            Labo.BigDog.prototype.fooBigDog = function(){
            }
        }
        //---------------------------------------------------------------------
        // 2) Create all the classes
        //---------------------------------------------------------------------
        Labo.Animal.__initClass();
        Labo.BigDog.__initClass();
        Labo.Dog.__initClass();
        //---------------------------------------------------------------------
        // 3) Test each created class.
        //---------------------------------------------------------------------
        QUnit.test( "testAnimal" , function(assert){
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
        //---------------------------------------------------------------------
        QUnit.test( "testDog" , function( assert ) {
            var d1 = new Labo.Dog( "d1" , "red" );
            var d2 = new Labo.Dog( "d2" , "blue" );
            assert.equal(d1.cry(), "Labo.Dog: 'd1', whose color is 'red', cries whoua!" , "cry() by d1" );
            assert.equal(d2.cry(), "Labo.Dog: 'd2', whose color is 'blue', cries whoua!" , "cry() by d2"  );
            assert.equal( typeof d1, "object", "typeof a1" );
            assert.ok( d1 instanceof Labo.Dog, "d1 intanceof Labo.Dog" );
            assert.ok( d1 instanceof Labo.Animal, "d1 intanceof Labo.Animal" );
            assert.ok( "fooDog" in d1, "d1 has property fooDog" );
        });
        //---------------------------------------------------------------------
        QUnit.test( "testBigDog" , function( assert ) {
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
        //---------------------------------------------------------------------
    });
};
///////////////////////////////////////////////////////////////////////////////
