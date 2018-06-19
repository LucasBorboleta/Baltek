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
baltek.widget.CounterWithFraction = function(id, i18nTranslator, maximum){
    this.__initObject(id, i18nTranslator, maximum);
};

baltek.widget.CounterWithFraction.__initClassCalled = false;

baltek.widget.CounterWithFraction.__initClass = function(){

    if ( baltek.widget.CounterWithFraction.__initClassCalled ) return;
    baltek.widget.CounterWithFraction.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithFraction, baltek.widget.Widget);

    baltek.widget.CounterWithFraction.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.CounterWithFraction.super.__initObject.call(this, id, i18nTranslator);

        this.maximum = 0;
        this.count = 0;

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.CounterWithFraction.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        baltek.utils.assert( count <= this.maximum );
        this.count = count;
        this.update();
    };

    baltek.widget.CounterWithFraction.prototype.setMaximum = function(maximum){
        baltek.utils.assert( maximum >= 0 );
        baltek.utils.assert( this.count <= maximum );
        this.maximum = maximum;
        this.update();
    };

    baltek.widget.CounterWithFraction.prototype.update = function(){
        this.element.innerHTML = this.count + "/" + this.maximum;
    };

    baltek.widget.CounterWithFraction.prototype.updateFromI18nTranslator = function(){
    };
};
///////////////////////////////////////////////////////////////////////////////
