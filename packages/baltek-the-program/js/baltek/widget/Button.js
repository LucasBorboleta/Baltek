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
baltek.widget.Button = function(id, i18nTranslator){
    this.__initObject(id, i18nTranslator);
};

baltek.widget.Button.__initClassCalled = false;

baltek.widget.Button.__initClass = function(){

    if ( baltek.widget.Button.__initClassCalled ) return;
    baltek.widget.Button.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Button, baltek.widget.Widget);

    baltek.widget.Button.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.Button.super.__initObject.call(this, id, i18nTranslator);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();

        var thisSaved = this;
        var eventHandler = function(event){ thisSaved.notifyObservers(thisSaved.userInputAspect); };
        this.element.onclick = eventHandler;
    };

    baltek.widget.Button.prototype.updateFromI18nTranslator = function(){
        this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    };
};
///////////////////////////////////////////////////////////////////////////////
