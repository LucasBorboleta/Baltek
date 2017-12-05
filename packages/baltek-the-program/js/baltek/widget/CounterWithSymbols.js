"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget.CounterWithSymbols = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
    this.__initObject(id, i18nTranslator, maximum, zeroSymbol, oneSymbol);
};

baltek.widget.CounterWithSymbols.__initClassCalled = false;

baltek.widget.CounterWithSymbols.__initClass = function(){

    if ( baltek.widget.CounterWithSymbols.__initClassCalled ) return;
    baltek.widget.CounterWithSymbols.__initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithSymbols, baltek.widget.Widget);

    baltek.widget.CounterWithSymbols.prototype.__initObject = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
        baltek.widget.CounterWithSymbols.super.__initObject.call(this, id, i18nTranslator);

        baltek.utils.assert( maximum >= 1 );
        baltek.utils.assert( zeroSymbol.length === 1 );
        baltek.utils.assert( oneSymbol.length === 1 );
        baltek.utils.assert( zeroSymbol !== oneSymbol );
        this.maximum = maximum;
        this.zeroSymbol = zeroSymbol;
        this.oneSymbol = oneSymbol;
        this.setCount(0);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    };

    baltek.widget.CounterWithSymbols.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        baltek.utils.assert( count <= this.maximum );

        var text = baltek.utils.repeatString(this.zeroSymbol, this.maximum - count) +
                   baltek.utils.repeatString(this.oneSymbol, count) ;
        this.element.innerHTML = text;
    };

    baltek.widget.CounterWithSymbols.prototype.updateFromI18nTranslator = function(){
    };
};
///////////////////////////////////////////////////////////////////////////////
