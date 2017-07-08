"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Button = function(id, i18nTranslator){
    this.__initObject(id, i18nTranslator);
}

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
        var eventHandler = function(event){ thisSaved.notifyObservers(); };
        this.element.onclick = eventHandler;
    }

    baltek.widget.Button.prototype.updateFromI18nTranslator = function(){
        this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    }
}
///////////////////////////////////////////////////////////////////////////////
