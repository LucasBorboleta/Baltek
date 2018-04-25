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
baltek.widget.CounterWithDecimals = function(id, i18nTranslator, maximum){
    this.__initObject(id, i18nTranslator, maximum);
};

baltek.widget.CounterWithDecimals.__initClassCalled = false;

baltek.widget.CounterWithDecimals.__initClass = function(){

    if ( baltek.widget.CounterWithDecimals.__initClassCalled ) return;
    baltek.widget.CounterWithDecimals.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithDecimals, baltek.widget.Widget);

    baltek.widget.CounterWithDecimals.prototype.__initObject = function(id, i18nTranslator, maximum){
        baltek.widget.CounterWithDecimals.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( maximum >= 1 );
        this.maximum = maximum;
        this.numberOfDigits = Math.ceil( Math.log(this.maximum)/Math.LN10 );
        this.setCount(0);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.CounterWithDecimals.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        var text = count.toString();
        baltek.utils.assert( text.length <= this.numberOfDigits );
        var zeroSymbol = "0";
        text = baltek.utils.repeatString(zeroSymbol, this.numberOfDigits - text.length) + text;
        this.element.innerHTML = text;
    };

    baltek.widget.CounterWithDecimals.prototype.updateFromI18nTranslator = function(){
    };
};
///////////////////////////////////////////////////////////////////////////////
