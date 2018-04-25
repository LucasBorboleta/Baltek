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
baltek.widget.Widget = function(id, i18nTranslator){
    this.__initObject(id, i18nTranslator);
};

baltek.widget.Widget.__initClassCalled = false;

baltek.widget.Widget.__initClass = function(){

    if ( baltek.widget.Widget.__initClassCalled ) return;
    baltek.widget.Widget.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Widget, baltek.utils.Observable);

    baltek.widget.Widget.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.Widget.super.__initObject.call(this);
        this.userInputAspect = this.newAspect( "userInputAspect" );

        baltek.utils.assert( i18nTranslator !== null );

        this.element = document.getElementById(id);

        this.i18nKeyPrefix = id;
        this.i18nTranslator = i18nTranslator;
        this.i18nLanguageAspect = this.i18nTranslator.getAspect( "languageAspect" );
        this.i18nTranslator.registerObserver(this, this.i18nLanguageAspect);
    };

    baltek.widget.Widget.prototype.enable = function(condition){
        this.element.disabled = ( ! condition );
    };

    baltek.widget.Widget.prototype.getI18nValueForKeySuffix = function(i18nKeySuffix){
        var translatedText = this.i18nTranslator.getValueForKey(this.i18nKeyPrefix, i18nKeySuffix);
        return translatedText;
    };

    baltek.widget.Widget.prototype.isEnabled = function(){
        return this.element.disabled;
    };

    baltek.widget.Widget.prototype.isShowed = function(){
        return ( this.element.style.display !== "none" );
    };

    baltek.widget.Widget.prototype.registerObserver = function(observer){
        baltek.widget.Widget.super.registerObserver.call(this, observer, this.userInputAspect);
    };

    baltek.widget.Widget.prototype.setBackgroundColor  = function(color){
        this.element.style.backgroundColor = color ;
    };

    baltek.widget.Widget.prototype.setColor = function(color){
        this.element.style.color = color ;
    };

    baltek.widget.Widget.prototype.show = function(condition){
        if ( condition ) {
            this.element.style.display = "inherit";
        } else {
            this.element.style.display = "none";
        }
    };

    baltek.widget.Widget.prototype.updateFromI18nTranslator = function(){
        baltek.utils.assert( false, "method must be redefined in subclass" );
    };

    baltek.widget.Widget.prototype.updateFromObservable = function(observable, aspect){
        if ( observable === this.i18nTranslator && aspect === this.i18nLanguageAspect ) {
            this.updateFromI18nTranslator();
        } else {
            baltek.utils.assert( false, "observable/aspect not managed" );
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
