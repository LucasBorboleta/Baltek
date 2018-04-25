"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL [https://github.com/LucasBorboleta/baltek-the-program](https://github.com/LucasBorboleta/baltek-the-program).

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses](http://www.gnu.org/licenses).
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.utils = { };
baltek.utils.__initModuleCalled = false;

baltek.utils.__initModule = function(){

    if ( baltek.utils.__initModuleCalled ) return;
    baltek.utils.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();

    // Init inner classes
    baltek.utils.Observable.__initClass();
};

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

        baltek.debug.writeMessage(text);
        alert(text);
        throw text;
    }
};

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
};

baltek.utils.hasValue = function(array, value){
    baltek.utils.assert( Array.isArray(array) );
    return (array.indexOf(value) > -1);
};

baltek.utils.inherit = function(childConstructor, parentConstructor){
    if ( childConstructor.prototype !== childConstructor ) {

        if ( parentConstructor !== Object ) {
            parentConstructor.__initClass();
        }

        // Copied from: http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
        // OOP In JavaScript: What You NEED to Know
        // march. 19 2013
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
};

baltek.utils.repeatString = function(value, count){
    // Workaround because not support of String.repeat in Internet-Explorer-11
    var text = "";
    var i = 0;
    for ( i=0; i<count; i++ ) {
        text += value;
    }
    return text;
};
///////////////////////////////////////////////////////////////////////////////
