"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget = { $initCalled: false };

baltek.widget.$init = function(){
    if ( ! baltek.widget.$initCalled ) {
        baltek.widget.$initCalled = true;

        // Init any package used by this one
        baltek.utils.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Widget = function(id, i18nTranslator){
    this.$init(id, i18nTranslator);
};

baltek.utils.inherit(baltek.widget.Widget, baltek.utils.Observable);

baltek.widget.Widget.prototype.$init = function(id, i18nTranslator){
    baltek.widget.Widget.super.$init.call(this);
    this.userInputAspect = this.newAspect("userInputAspect");

    this.element = document.getElementById(id);

    this.i18nKeyPrefix = id;
    this.i18nTranslator = i18nTranslator;
    this.i18nLanguageAspect = this.i18nTranslator.getAspect("languageAspect");
    this.i18nTranslator.registerObserver(this, this.i18nLanguageAspect);

}

baltek.widget.Widget.prototype.enable = function(condition){
    this.element.disabled = ( ! condition );
}

baltek.widget.Widget.prototype.getI18nValueForKeySuffix = function(i18nKeySuffix){
    var translatedText = this.i18nTranslator.getValueForKey(this.i18nKeyPrefix, i18nKeySuffix);
    return translatedText;
}

baltek.widget.Widget.prototype.isEnabled = function(){
    return this.element.disabled;
}

baltek.widget.Widget.prototype.isShowed = function(){
    return ( this.element.style.display !== "none" );
}

baltek.widget.Widget.prototype.setBackgroundColor  = function(color){
    this.element.style.backgroundColor = color ;
}

baltek.widget.Widget.prototype.setColor = function(color){
    this.element.style.color = color ;
}

baltek.widget.Widget.prototype.show = function(condition){
    if ( condition ) {
        this.element.style.display = "inherit";
    } else {
        this.element.style.display = "none";
    }
}

baltek.widget.Widget.prototype.updateFromI18nTranslator = function(){
    baltek.utils.assert( false, "must not be called" );
}

baltek.widget.Widget.prototype.updateFromObservable = function(observable, aspect){
    if ( observable === this.i18nTranslator && aspect === this.i18nLanguageAspect ) {
        this.updateFromI18nTranslator();
    } else {
        baltek.utils.assert( false, "observable/aspect not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Button = function(id, i18nTranslator){
    this.$init(id, i18nTranslator);
}

baltek.utils.inherit(baltek.widget.Button, baltek.widget.Widget);

baltek.widget.Button.prototype.$init = function(id, i18nTranslator){
    baltek.widget.Button.super.$init.call(this, id, i18nTranslator);

    // Finalize the construction regarding i18n.
    this.updateFromI18nTranslator();
}

baltek.widget.Button.prototype.updateFromI18nTranslator = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Counter = function(id, i18nTranslator, numberOfDigits){
    this.$init(id, i18nTranslator, numberOfDigits);
}

baltek.utils.inherit(baltek.widget.Counter, baltek.widget.Widget);

baltek.widget.Counter.prototype.$init = function(id, i18nTranslator, numberOfDigits){
    baltek.widget.Counter.super.$init.call(this, id, i18nTranslator);

    baltek.utils.assert( numberOfDigits >= 1 );
    this.numberOfDigits = numberOfDigits;
    this.setCount(0);

    // Finalize the construction regarding i18n.
    this.updateFromI18nTranslator();
}

baltek.widget.Counter.prototype.setCount = function(count){
    baltek.utils.assert( count >= 0 );
    var text = count.toString();
    baltek.utils.assert( text.length <= this.numberOfDigits );
    text = "0".repeat(this.numberOfDigits - text.length) + text;
    this.element.innerHTML = text;
}

baltek.widget.Counter.prototype.updateFromI18nTranslator = function(){
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.CounterBar = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
    this.$init(id, i18nTranslator, maximum, zeroSymbol, oneSymbol);
}

baltek.utils.inherit(baltek.widget.CounterBar, baltek.widget.Widget);

baltek.widget.CounterBar.prototype.$init = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
    baltek.widget.CounterBar.super.$init.call(this, id, i18nTranslator);

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
}

baltek.widget.CounterBar.prototype.setCount = function(count){
    baltek.utils.assert( count >= 0 );
    baltek.utils.assert( count <= this.maximum );
    var text = this.oneSymbol.repeat(count) + this.zeroSymbol.repeat(this.maximum - count);
    this.element.innerHTML = text;
}

baltek.widget.CounterBar.prototype.updateFromI18nTranslator = function(){
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.IFrame = function(id, i18nTranslator){
    this.$init(id, i18nTranslator);
};

baltek.utils.inherit(baltek.widget.IFrame, baltek.widget.Widget);

baltek.widget.IFrame.prototype.$init = function(id, i18nTranslator){
    baltek.widget.IFrame.super.$init.call(this, id, i18nTranslator);

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
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Selector = function(id, i18nTranslator, values){
    this.$init(id, i18nTranslator, values);
};

baltek.utils.inherit(baltek.widget.Selector, baltek.widget.Widget);

baltek.widget.Selector.prototype.$init = function(id, i18nTranslator, values){
    baltek.widget.Selector.super.$init.call(this, id, i18nTranslator);

    baltek.utils.assert( values.length >= 2 );
    this.values = values;

    // Finalize the construction regarding i18n.
    this.updateFromI18nTranslator();
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
///////////////////////////////////////////////////////////////////////////////
