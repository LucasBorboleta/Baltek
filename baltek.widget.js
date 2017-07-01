"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.widget = { };
baltek.widget.$initPackageCalled = false;

baltek.widget.$initPackage = function(){

    if ( baltek.widget.$initPackageCalled ) return;
    baltek.widget.$initPackageCalled = true;

    // Init required packages
    baltek.debug.$initPackage();
    baltek.utils.$initPackage();

    // Init inner classes
    baltek.widget.Button.$initClass();
    baltek.widget.CounterWithDecimals.$initClass();
    baltek.widget.CounterWithSymbols.$initClass();
    baltek.widget.IFrame.$initClass();
    baltek.widget.Selector.$initClass();
    baltek.widget.Widget.$initClass();


}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.getStylePropertyValue = function(elementId, propertyName){
    var element = document.getElementById(elementId);
    var style = window.getComputedStyle(element, null);
    var propertyValue = style.getPropertyValue(propertyName);
    return propertyValue;
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Widget = function(id, i18nTranslator){
    this.$initObject(id, i18nTranslator);
};

baltek.widget.Widget.$initClassCalled = false;

baltek.widget.Widget.$initClass = function(){

    if ( baltek.widget.Widget.$initClassCalled ) return;
    baltek.widget.Widget.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Widget, baltek.utils.Observable);

    baltek.widget.Widget.prototype.$initObject = function(id, i18nTranslator){
        baltek.widget.Widget.super.$initObject.call(this);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.Button = function(id, i18nTranslator){
    this.$initObject(id, i18nTranslator);
}

baltek.widget.Button.$initClassCalled = false;

baltek.widget.Button.$initClass = function(){

    if ( baltek.widget.Button.$initClassCalled ) return;
    baltek.widget.Button.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Button, baltek.widget.Widget);

    baltek.widget.Button.prototype.$initObject = function(id, i18nTranslator){
        baltek.widget.Button.super.$initObject.call(this, id, i18nTranslator);

        // Finalize the construction regarding i18n.
        this.updateFromI18nTranslator();
    }

    baltek.widget.Button.prototype.updateFromI18nTranslator = function(){
        this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.CounterWithDecimals = function(id, i18nTranslator, maximum){
    this.$initObject(id, i18nTranslator, maximum);
}

baltek.widget.CounterWithDecimals.$initClassCalled = false;

baltek.widget.CounterWithDecimals.$initClass = function(){

    if ( baltek.widget.CounterWithDecimals.$initClassCalled ) return;
    baltek.widget.CounterWithDecimals.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithDecimals, baltek.widget.Widget);

    baltek.widget.CounterWithDecimals.prototype.$initObject = function(id, i18nTranslator, maximum){
        baltek.widget.CounterWithDecimals.super.$initObject.call(this, id, i18nTranslator);

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
baltek.widget.CounterWithSymbols = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
    this.$initObject(id, i18nTranslator, maximum, zeroSymbol, oneSymbol);
}

baltek.widget.CounterWithSymbols.$initClassCalled = false;

baltek.widget.CounterWithSymbols.$initClass = function(){

    if ( baltek.widget.CounterWithSymbols.$initClassCalled ) return;
    baltek.widget.CounterWithSymbols.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.CounterWithSymbols, baltek.widget.Widget);

    baltek.widget.CounterWithSymbols.prototype.$initObject = function(id, i18nTranslator, maximum, zeroSymbol, oneSymbol){
        baltek.widget.CounterWithSymbols.super.$initObject.call(this, id, i18nTranslator);

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

    baltek.widget.CounterWithSymbols.prototype.setCount = function(count){
        baltek.utils.assert( count >= 0 );
        baltek.utils.assert( count <= this.maximum );

        var text = baltek.utils.repeatString(this.oneSymbol, count) +
                   baltek.utils.repeatString(this.zeroSymbol, this.maximum - count);
        this.element.innerHTML = text;
    }

    baltek.widget.CounterWithSymbols.prototype.updateFromI18nTranslator = function(){
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.IFrame = function(id, i18nTranslator){
    this.$initObject(id, i18nTranslator);
};

baltek.widget.IFrame.$initClassCalled = false;

baltek.widget.IFrame.$initClass = function(){

    if ( baltek.widget.IFrame.$initClassCalled ) return;
    baltek.widget.IFrame.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.IFrame, baltek.widget.Widget);

    baltek.widget.IFrame.prototype.$initObject = function(id, i18nTranslator){
        baltek.widget.IFrame.super.$initObject.call(this, id, i18nTranslator);

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
baltek.widget.Selector = function(id, i18nTranslator, values){
    this.$initObject(id, i18nTranslator, values);
};

baltek.widget.Selector.$initClassCalled = false;

baltek.widget.Selector.$initClass = function(){

    if ( baltek.widget.Selector.$initClassCalled ) return;
    baltek.widget.Selector.$initClassCalled = true;

    baltek.utils.inherit(baltek.widget.Selector, baltek.widget.Widget);

    baltek.widget.Selector.prototype.$initObject = function(id, i18nTranslator, values){
        baltek.widget.Selector.super.$initObject.call(this, id, i18nTranslator);

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
}
///////////////////////////////////////////////////////////////////////////////
