"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
///////////////////////////////////////////////////////////////////////////////
baltek.i18n.Translator = function(translations, fallbackLanguage){
    this.__initObject(translations, fallbackLanguage);
};

baltek.i18n.Translator.__initClassCalled = false;

baltek.i18n.Translator.__initClass = function(){

    if ( baltek.i18n.Translator.__initClassCalled ) return;
    baltek.i18n.Translator.__initClassCalled = true;

    baltek.utils.inherit(baltek.i18n.Translator, baltek.utils.Observable);

    baltek.i18n.Translator.prototype.__initObject = function(translations, fallbackLanguage){
        baltek.i18n.Translator.super.__initObject.call(this);

        this.languageAspect = this.newAspect("languageAspect");

        this.keySeparator = ":" ;

        this.translations = translations;
        this.availableLanguages = baltek.utils.getOwnProperties(this.translations);

        baltek.utils.assert( baltek.utils.hasValue(this.availableLanguages, fallbackLanguage) );
        this.fallbackLanguage = fallbackLanguage ;

        this.language = this.getDefaultLanguage();
        if ( ! baltek.utils.hasValue(this.availableLanguages, this.language) ) {
            this.language = this.fallbackLanguage;
        }
    }

    baltek.i18n.Translator.prototype.getAvailableLanguages = function(){
        return this.availableLanguages;
    }

    baltek.i18n.Translator.prototype.getDefaultLanguage = function(){
        var languageTag = navigator.language;
        var languageSubTags = languageTag.split( '-' );
        var languagePrimarySubTag = languageSubTags[0];
        var defaultLanguage = languagePrimarySubTag;

        return defaultLanguage;
    }

    baltek.i18n.Translator.prototype.getLanguage = function(){
        return this.language;
    }

    baltek.i18n.Translator.prototype.getValueForKey = function(i18nKeyPrefix, i18nKeySuffix){
        var i18nKey = i18nKeyPrefix + this.keySeparator + i18nKeySuffix;

        baltek.utils.assert( this.translations[this.language].hasOwnProperty(i18nKey) );

        var value = this.translations[this.language][i18nKey];
        return value;
    }

    baltek.i18n.Translator.prototype.setLanguage = function(language){
        baltek.utils.assert( baltek.utils.hasValue(this.availableLanguages, language) );
        this.language = language;
        this.notifyObservers(this.languageAspect);
    }
}
///////////////////////////////////////////////////////////////////////////////
