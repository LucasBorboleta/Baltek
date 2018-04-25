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
baltek.widget.Selector = function(id, i18nTranslator, values){
    this.__initObject(id, i18nTranslator, values);
};

baltek.widget.Selector.__initClassCalled = false;

baltek.widget.Selector.__initClass = function(){

    if ( baltek.widget.Selector.__initClassCalled ) return;
    baltek.widget.Selector.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Selector, baltek.widget.Widget);

    baltek.widget.Selector.prototype.__initObject = function(id, i18nTranslator, values){
        baltek.widget.Selector.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( values.length >= 2 );
        this.values = values;

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();

        var thisSaved = this;
        var eventHandler = function(event){ thisSaved.notifyObservers(thisSaved.userInputAspect); };
        this.element.onchange = eventHandler;
    };

    baltek.widget.Selector.prototype.getSelection = function(){
        return this.element.value;
    };

    baltek.widget.Selector.prototype.setSelection = function(selection){
        baltek.utils.assert( baltek.utils.hasValue(this.values, selection) );
        this.element.value = selection;
    };

    baltek.widget.Selector.prototype.updateFromI18nTranslator = function(){
        var selection = this.element.value;
        if ( selection === undefined || this.element.value === "" ) {
            selection = this.values[0];
        }

        this.element.innerHTML = "" ;

        var n = this.values.length;
        var i = 0;
        for ( i=0; i < n ; i++ ) {
            var value = this.values[i];
            var text = this.getI18nValueForKeySuffix(value);

            this.element.innerHTML +=
                "<option value=" + "\"" +  value + "\"" + ">" + text + "</option>" ;
        }

        this.element.value = selection;
    };
};
///////////////////////////////////////////////////////////////////////////////
