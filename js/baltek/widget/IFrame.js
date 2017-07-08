"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget.IFrame = function(id, i18nTranslator){
    this.__initObject(id, i18nTranslator);
};

baltek.widget.IFrame.__initClassCalled = false;

baltek.widget.IFrame.__initClass = function(){

    if ( baltek.widget.IFrame.__initClassCalled ) return;
    baltek.widget.IFrame.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.IFrame, baltek.widget.Widget);

    baltek.widget.IFrame.prototype.__initObject = function(id, i18nTranslator){
        baltek.widget.IFrame.super.__initObject.call(this, id, i18nTranslator);

        this.show(false);
        this.src = "" ;
        this.element.src = this.src;

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    }

    baltek.widget.IFrame.prototype.show = function(condition){
        baltek.widget.IFrame.super.show.call(this, condition);

        if ( this.isShowed() ) {
            this.element.src = this.src;
        }
    }

    baltek.widget.IFrame.prototype.updateFromI18nTranslator = function(){
        this.src = this.getI18nValueForKeySuffix( "file" );

        if ( this.isShowed() ) {
            this.element.src = this.src;
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
