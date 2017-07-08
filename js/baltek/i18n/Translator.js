"use strict";
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
