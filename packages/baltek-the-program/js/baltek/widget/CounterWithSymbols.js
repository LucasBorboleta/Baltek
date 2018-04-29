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
baltek.widget.CounterWithSymbols = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
    this.__initObject(id, i18nTranslator, maximum, zeroSymbol, oneSymbol);
};

baltek.widget.CounterWithSymbols.__initClassCalled = false;

baltek.widget.CounterWithSymbols.__initClass = function(){

    if ( baltek.widget.CounterWithSymbols.__initClassCalled ) return;
    baltek.widget.CounterWithSymbols.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithSymbols, baltek.widget.Widget);

    baltek.widget.CounterWithSymbols.prototype.__initObject = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
        baltek.widget.CounterWithSymbols.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( maximum >= 1 );
        baltek.utils.assert( zeroSymbol.length === 1 );
        baltek.utils.assert( oneSymbol.length === 1 );
        baltek.utils.assert( zeroSymbol !== oneSymbol );
        this.maximum = maximum;
        this.zeroSymbol = zeroSymbol;
        this.oneSymbol = oneSymbol;
        this.setCount(0);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.CounterWithSymbols.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        baltek.utils.assert( count <= this.maximum );

        var text = baltek.utils.repeatString(this.zeroSymbol, this.maximum - count) +
                   baltek.utils.repeatString(this.oneSymbol, count) ;
        this.element.innerHTML = text;
    };

    baltek.widget.CounterWithSymbols.prototype.updateFromI18nTranslator = function(){
    };
};
///////////////////////////////////////////////////////////////////////////////
