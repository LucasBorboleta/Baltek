"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Selector = function(id, i18nTranslator, values){
    this.__initObject(id, i18nTranslator, values);
};

baltek.widget.Selector.__initClassCalled = false;

baltek.widget.Selector.__initClass = function(){

    if ( baltek.widget.Selector.__initClassCalled ) return;
    baltek.widget.Selector.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Selector, baltek.widget.Widget);

    baltek.widget.Selector.prototype.__initObject = function(id, i18nTranslator, values){
        baltek.widget.Selector.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( values.length >= 2 );
        this.values = values;

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();

        var thisSaved = this;
        var eventHandler = function(event){ thisSaved.notifyObservers(); };
        this.element.onchange = eventHandler;
    }

    baltek.widget.Selector.prototype.getSelection = function(){
        return this.element.value;
    }

    baltek.widget.Selector.prototype.setSelection = function(selection){
        baltek.utils.assert( baltek.utils.hasValue(this.values, selection) );
        this.element.value = selection;
    }

    baltek.widget.Selector.prototype.updateFromI18nTranslator = function(){
        var selection = this.element.value;
        if ( selection === undefined || this.element.value === "" ) {
            selection = this.values[0];
        }

        this.element.innerHTML = "" ;

        var n = this.values.length;
        var i = 0;
        for ( i=0; i < n ; i++ ) {
            var value = this.values[i];
            var text = this.getI18nValueForKeySuffix(value);

            this.element.innerHTML +=
                "<option value=" + "\"" +  value + "\"" + ">" + text + "</option>" ;
        }

        this.element.value = selection;
    }
}
///////////////////////////////////////////////////////////////////////////////
