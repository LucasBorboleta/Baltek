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
};

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
baltek.widget.FileToFrameButton = function(id, i18nTranslator, frame, mutexDisplay){
    this.$init(id, i18nTranslator, frame, mutexDisplay);
};

baltek.utils.inherit(baltek.widget.FileToFrameButton, baltek.widget.Widget);

baltek.widget.FileToFrameButton.prototype.$init = function(id, i18nTranslator, frame, mutexDisplay){
    baltek.widget.FileToFrameButton.super.$init.call(this, id, i18nTranslator);

    this.file = null;
    this.frame = frame;
    this.mutexDisplay = mutexDisplay;

    // Finalize the construction regarding i18n.
    this.updateFromI18nTranslator();
}

baltek.widget.FileToFrameButton.prototype.openFile = function(){
    this.frame.src = this.file;
    this.mutexDisplay.setActiveDisplayer(this.frame);
    // Update the file path after its browser interpretation, because
    // it might be an absolute path.
    this.file = this.frame.src;
}

baltek.widget.FileToFrameButton.prototype.updateFromI18nTranslator = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );

    var previousFile = this.file;
    this.file = this.getI18nValueForKeySuffix( "file" );

    if ( this.mutexDisplay.isActiveDisplayer(this.frame) && this.frame.src === previousFile) {
        this.openFile();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.FileToWindowButton = function(id, i18nTranslator){
    this.$init(id, i18nTranslator);
};

baltek.utils.inherit(baltek.widget.FileToWindowButton, baltek.widget.Widget);

baltek.widget.FileToWindowButton.prototype.$init = function(id, i18nTranslator){
    baltek.widget.FileToWindowButton.super.$init.call(this, id, i18nTranslator);

    this.file = undefined;
    this.openedFile = undefined;
    this.window = null;

    // Finalize the construction regarding i18n.
    this.updateFromI18nTranslator();
}

baltek.widget.FileToWindowButton.prototype.openFile = function(){
    if ( this.window !== null && this.openedFile !== this.file ) {
        this.window.close();
        this.openedFile = undefined;
    }

    if ( this.window === null || this.window.closed ) {
        this.window = window.open(this.file);
        this.openedFile = this.file;
    } else {
        this.window.focus();
    }
}

baltek.widget.FileToWindowButton.prototype.updateFromI18nTranslator = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    this.file = this.getI18nValueForKeySuffix( "file" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.widget.MutexDisplay = function(){
    this.$init();
};

baltek.utils.inherit(baltek.widget.MutexDisplay, Object);

baltek.widget.MutexDisplay.prototype.$init = function(){
    this.displayers = [];
    this.activeDisplayer = null;
}

baltek.widget.MutexDisplay.prototype.isActiveDisplayer = function(displayer){
    var displayerIndex = this.displayers.indexOf(displayer);
    baltek.utils.assert(displayerIndex > -1);
    return ( displayer === this.activeDisplayer );
}

baltek.widget.MutexDisplay.prototype.registerDisplayer = function(displayer){
    var displayerIndex = this.displayers.indexOf(displayer);
    if ( ! ( displayerIndex > -1 ) ) {
        this.displayers.push(displayer);
        displayer.style.display = "none";
    }
}

baltek.widget.MutexDisplay.prototype.setActiveDisplayer = function(displayer){
    var displayerIndex = this.displayers.indexOf(displayer);
    baltek.utils.assert(displayerIndex > -1);

    var displayerCount = this.displayers.length;
    for ( displayerIndex=0; displayerIndex < displayerCount; displayerIndex++ ) {
        this.displayers[displayerIndex].style.display = "none";
    }

    this.activeDisplayer = displayer;
    this.activeDisplayer.style.display = "inherit";
}

baltek.widget.MutexDisplay.prototype.unregisterDisplayer = function(displayer){
    var displayerIndex = this.displayers.indexOf(displayer);
    baltek.utils.assert(displayerIndex > -1);
    if ( displayerIndex > -1 ) {
        this.displayers.splice(displayerIndex, 1);

        if ( displayer === this.activeDisplayer ) {
            this.activeDisplayer.style.display = "none";
            this.activeDisplayer = null;
        }
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
