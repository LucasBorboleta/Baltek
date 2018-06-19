"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/slides/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.widget.TextSlider = function(id, i18nTranslator, values){
    this.__initObject(id, i18nTranslator);
};

baltek.widget.TextSlider.__initClassCalled = false;

baltek.widget.TextSlider.__initClass = function(){

    if ( baltek.widget.TextSlider.__initClassCalled ) return;
    baltek.widget.TextSlider.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.TextSlider, baltek.widget.Widget);

    baltek.widget.TextSlider.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.TextSlider.super.__initObject.call(this, id, i18nTranslator);

        this.languages = this.i18nTranslator.getAvailableLanguages();
        this.language = this.i18nTranslator.getLanguage();
        this.index = -1;
        this.slides = [];

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.TextSlider.prototype.add = function(slide){
        baltek.utils.assert( JSON.stringify(baltek.utils.getOwnProperties(slide)) === JSON.stringify(this.languages) );
        this.slides.push(slide);
    };

    baltek.widget.TextSlider.prototype.canMoveNext = function(){
        return ( this.slides.length !== 0 && this.index != (this.slides.length - 1) );
    }

    baltek.widget.TextSlider.prototype.canMovePrevious = function(){
        return ( this.slides.length !== 0 && this.index != 0 );
    }

    baltek.widget.TextSlider.prototype.getIndex = function(){
        return this.index;
    };

    baltek.widget.TextSlider.prototype.count = function(){
        return this.slides.length;
    };

    baltek.widget.TextSlider.prototype.moveFirst = function(){
        if ( this.slides.length !== 0 ) {
            this.index = 0;
            this.updatePicture();
        }
    };

    baltek.widget.TextSlider.prototype.moveLast = function(){
        if ( this.slides.length !== 0 ) {
            this.index = this.slides.length - 1;
            this.updatePicture();
        }
    };

    baltek.widget.TextSlider.prototype.moveNext = function(){
        if ( this.slides.length !== 0) {
            if ( this.index < (this.slides.length - 1) ) {
                this.index++;
                this.updatePicture();
            }
        }
    };

    baltek.widget.TextSlider.prototype.movePrevious = function(){
        if ( this.slides.length !== 0 ) {
            if ( this.index > 0 ) {
                this.index--;
                this.updatePicture();
            }
        }
    };

    baltek.widget.TextSlider.prototype.updateFromI18nTranslator = function(){
        this.language = this.i18nTranslator.getLanguage();
        this.updatePicture();
    };

    baltek.widget.TextSlider.prototype.updatePicture = function(){
        if ( this.slides.length !== 0 ) {
            this.element.innerHTML = this.slides[this.index][this.language];
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
