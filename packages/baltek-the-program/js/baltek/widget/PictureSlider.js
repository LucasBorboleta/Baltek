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
baltek.widget.PictureSlider = function(id, i18nTranslator, values){
    this.__initObject(id, i18nTranslator);
};

baltek.widget.PictureSlider.__initClassCalled = false;

baltek.widget.PictureSlider.__initClass = function(){

    if ( baltek.widget.PictureSlider.__initClassCalled ) return;
    baltek.widget.PictureSlider.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.PictureSlider, baltek.widget.Widget);

    baltek.widget.PictureSlider.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.PictureSlider.super.__initObject.call(this, id, i18nTranslator);

        this.languages = this.i18nTranslator.getAvailableLanguages();
        this.language = this.i18nTranslator.getLanguage();
        this.index = -1;
        this.slides = [];

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.PictureSlider.prototype.add = function(slide){
        baltek.utils.assert( JSON.stringify(baltek.utils.getOwnProperties(slide)) === JSON.stringify(this.languages) );
        this.slides.push(slide);
    };

    baltek.widget.PictureSlider.prototype.canMoveNext = function(){
        return ( this.slides.length !== 0 && this.index != (this.slides.length - 1) );
    }

    baltek.widget.PictureSlider.prototype.canMovePrevious = function(){
        return ( this.slides.length !== 0 && this.index != 0 );
    }

    baltek.widget.PictureSlider.prototype.count = function(){
        return this.slides.length;
    };

    baltek.widget.PictureSlider.prototype.moveFirst = function(){
        if ( this.slides.length !== 0 ) {
            this.index = 0;
            this.updatePicture();
        }
    };

    baltek.widget.PictureSlider.prototype.moveLast = function(){
        if ( this.slides.length !== 0 ) {
            this.index = this.slides.length - 1;
            this.updatePicture();
        }
    };

    baltek.widget.PictureSlider.prototype.moveNext = function(){
        if ( this.slides.length !== 0) {
            if ( this.index < (this.slides.length - 1) ) {
                this.index++;
                this.updatePicture();
            }
        }
    };

    baltek.widget.PictureSlider.prototype.movePrevious = function(){
        if ( this.slides.length !== 0 ) {
            if ( this.index > 0 ) {
                this.index--;
                this.updatePicture();
            }
        }
    };

    baltek.widget.PictureSlider.prototype.updateFromI18nTranslator = function(){
        this.language = this.i18nTranslator.getLanguage();
        this.updatePicture();
    };

    baltek.widget.PictureSlider.prototype.updatePicture = function(){
        if ( this.slides.length !== 0 ) {
            this.element.src = this.slides[this.index][this.language];
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
