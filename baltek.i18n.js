"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.i18n = { };
baltek.i18n.$initPackageCalled = false;

baltek.i18n.$initPackage = function(){
    if ( baltek.i18n.$initPackageCalled ) return;
    baltek.i18n.$initPackageCalled = true;

    // Init required packages
    baltek.debug.$initPackage();
    baltek.utils.$initPackage();

    // Init inner classes
    baltek.i18n.Translator.$initClass();
}
///////////////////////////////////////////////////////////////////////////////
baltek.i18n.Translator = function(translations, fallbackLanguage){
    this.$initObject(translations, fallbackLanguage);
};

baltek.i18n.Translator.$initClassCalled = false;

baltek.i18n.Translator.$initClass = function(){

    if ( baltek.i18n.Translator.$initClassCalled ) return;
    baltek.i18n.Translator.$initClassCalled = true;

    baltek.utils.inherit(baltek.i18n.Translator, baltek.utils.Observable);

    baltek.i18n.Translator.prototype.$initObject = function(translations, fallbackLanguage){
        baltek.i18n.Translator.super.$initObject.call(this);

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
