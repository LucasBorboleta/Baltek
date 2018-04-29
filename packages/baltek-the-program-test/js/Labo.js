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
$.noConflict()
///////////////////////////////////////////////////////////////////////////////
var Labo = {};
///////////////////////////////////////////////////////////////////////////////
Labo.DEBUG = ( jQuery( "#Labo_debugZone" ) != null ) ;
Labo.DEBUG_LINES = jQuery( "#Labo_debugLines" );

Labo.clearDebugText = function(){
    if ( Labo.DEBUG ) {
        Labo.DEBUG_LINES.html( "" );
    }
}

Labo.writeDebugText = function(text){
    if( Labo.DEBUG ){
        Labo.DEBUG_LINES.prepend("<li>" + text + "</li>");
    }
}
///////////////////////////////////////////////////////////////////////////////
Labo.assert = function(condition,message){
    if( ! condition ) {
        var text = "Labo.assert failure: " + message;
        Labo.writeDebugText(text);
        alert(text);
    }
}
///////////////////////////////////////////////////////////////////////////////
Labo.inArray = function(value,array){
    return ( array.indexOf(value) > -1 );
}
///////////////////////////////////////////////////////////////////////////////
Labo.inheritPrototype = function(childConstructor, parentConstructor){
    if ( childConstructor.prototype !== childConstructor ) {
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
        // in the "inheritPrototype(childConstructor, parentConstructor)"
        // statement.
        childConstructor.super = parentConstructor.prototype;
    }
}
///////////////////////////////////////////////////////////////////////////////
Labo.Animal = function(name){
    this.init(name);
}

Labo.Animal.initCalled = false;

Labo.Animal.init = function(){
    if ( ! Labo.Animal.initCalled ) {
        Labo.Animal.initCalled = true;
        Labo.inheritPrototype(Labo.Animal,Object);
    }

    Labo.Animal.prototype.init = function(name){
        this.name = name;
    }

    Labo.Animal.prototype.cry = function(){
        var text = "Labo.Animal: '" + this.name + "' cries something!" ;
        Labo.writeDebugText(text);
        return text;
    }
    Labo.Animal.prototype.fooAnimal = function(){
    }
}
///////////////////////////////////////////////////////////////////////////////
Labo.Dog = function(name,color){
    this.init(name,color);
}

Labo.Dog.initCalled = false;

Labo.Dog.init = function(){
    if ( ! Labo.Dog.initCalled ) {
        Labo.Dog.initCalled = true;
        Labo.Animal.init();
        Labo.inheritPrototype(Labo.Dog, Labo.Animal);

        Labo.Dog.prototype.init = function(name,color){
            Labo.Dog.super.init.call(this,name);
            this.color = color;
        }

        Labo.Dog.prototype.cry = function(){
            var text = "Labo.Dog: '" + this.name + "', whose color is '" + this.color +
                       "', cries whoua!" ;
            Labo.writeDebugText(text);
            return text;
        }

        Labo.Dog.prototype.fooDog = function(){
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
Labo.BigDog = function(name,color,size){
    this.init(name,color,size);
}

Labo.BigDog.initCalled = false;

Labo.BigDog.init = function(){
    if ( ! Labo.BigDog.initCalled ) {
        Labo.BigDog.initCalled = true;
        Labo.Dog.init();
        Labo.inheritPrototype(Labo.BigDog, Labo.Dog);
    }

    Labo.BigDog.prototype.init = function(name,color,size){
       Labo.BigDog.super.init.call(this,name,color);
       this.size = size;
    }

    Labo.BigDog.prototype.cry = function(){
       var text = "Labo.Dog: '" + this.name + "', whose color and size are '" +
                  this.color + "' and '" + this.size + "', cries whoua whoua!";
       Labo.writeDebugText(text);
       return text;
    }

    Labo.BigDog.prototype.fooBigDog = function(){
    }
}
///////////////////////////////////////////////////////////////////////////////
jQuery(document).ready(function(){

    Labo.Animal.init();
    Labo.BigDog.init();
    Labo.Dog.init();

    Labo.writeDebugText( "Labo.js: Loaded." );
});
