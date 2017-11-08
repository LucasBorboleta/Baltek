"use strict";
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
        this.userInputAspect = this.newAspect("userInputAspect");

        this.element = document.getElementById(id);

        this.i18nKeyPrefix = id;
        this.i18nTranslator = i18nTranslator;

        if ( this.i18nTranslator !== null ) {
            this.i18nLanguageAspect = this.i18nTranslator.getAspect("languageAspect");
            this.i18nTranslator.registerObserver(this, this.i18nLanguageAspect);
        }
    };

    baltek.widget.Widget.prototype.enable = function(condition){
        this.element.disabled = ( ! condition );
    };

    baltek.widget.Widget.prototype.getI18nValueForKeySuffix = function(i18nKeySuffix){
        baltek.utils.assert( this.i18nTranslator !== null );
        var translatedText = this.i18nTranslator.getValueForKey(this.i18nKeyPrefix, i18nKeySuffix);
        return translatedText;
    };

    baltek.widget.Widget.prototype.isEnabled = function(){
        return this.element.disabled;
    };

    baltek.widget.Widget.prototype.isShowed = function(){
        return ( this.element.style.display !== "none" );
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
        baltek.utils.assert( false, "must not be called" );
    };

    baltek.widget.Widget.prototype.updateFromObservable = function(observable, aspect){
        if ( this.i18nTranslator !== null && observable === this.i18nTranslator && aspect === this.i18nLanguageAspect ) {
            this.updateFromI18nTranslator();
        } else {
            baltek.utils.assert( false, "observable/aspect not managed" );
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
