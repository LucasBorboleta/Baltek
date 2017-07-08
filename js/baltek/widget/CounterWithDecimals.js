"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget.CounterWithDecimals = function(id, i18nTranslator, maximum){
    this.__initObject(id, i18nTranslator, maximum);
}

baltek.widget.CounterWithDecimals.__initClassCalled = false;

baltek.widget.CounterWithDecimals.__initClass = function(){

    if ( baltek.widget.CounterWithDecimals.__initClassCalled ) return;
    baltek.widget.CounterWithDecimals.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithDecimals, baltek.widget.Widget);

    baltek.widget.CounterWithDecimals.prototype.__initObject = function(id, i18nTranslator, maximum){
        baltek.widget.CounterWithDecimals.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( maximum >= 1 );
        this.maximum = maximum;
        this.numberOfDigits = Math.ceil( Math.log(this.maximum)/Math.LN10 );
        this.setCount(0);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    }

    baltek.widget.CounterWithDecimals.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        var text = count.toString();
        baltek.utils.assert( text.length <= this.numberOfDigits );
        var zeroSymbol = "0";
        text = baltek.utils.repeatString(zeroSymbol, this.numberOfDigits - text.length) + text;
        this.element.innerHTML = text;
    }

    baltek.widget.CounterWithDecimals.prototype.updateFromI18nTranslator = function(){
    }
}
///////////////////////////////////////////////////////////////////////////////
