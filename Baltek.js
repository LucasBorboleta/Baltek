"use strict";
///////////////////////////////////////////////////////////////////////////////
var Baltek = { initCalled: false };

Baltek.$init = function(){
    if ( ! Baltek.initCalled ) {
        Baltek.initCalled = true;

        Baltek.Utils.$init();
        Baltek.View.$init();
        Baltek.presenter = new Baltek.Presenter();

        Baltek.View.DebugZone.writeMessage( "Baltek.$init(): done" );
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Utils = { initCalled: false };

Baltek.Utils.$init = function(){
    if ( ! Baltek.Utils.initCalled ) {
        Baltek.Utils.initCalled = true;
    }
}

Baltek.Utils.assert = function(condition, message){
    if( ! condition ){
        var text = "Baltek.Utils.assert(): failure: " + message;
        console.log(text);
        Baltek.View.DebugZone.writeMessage(text);
        alert(text);
        throw text;
    }
}

Baltek.Utils.getOwnProperties = function(anObject){
    var properties = [];
    var aProperty;
    for (aProperty in anObject) {
        if ( anObject.hasOwnProperty(aProperty) ) {
            properties.push(aProperty);
        }
    }
    properties.sort();
    return properties;
}

Baltek.Utils.hasValue = function(array, value){
    Baltek.Utils.assert( Array.isArray(array), "Baltek.Utils.hasValue(): Array.isArray(array)" )
    return (array.indexOf(value) > -1);
}

Baltek.Utils.inheritPrototype = function(childConstructor, parentConstructor){

    // Copied from: http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
    // OOP In JavaScript: What You NEED to Know
    // march. 19 2013 215
    // (Object Oriented JavaScript: Only Two Techniques Matter)

    var copyOfParent = Object.create(parentConstructor.prototype);
    copyOfParent.constructor = childConstructor;
    childConstructor.prototype = copyOfParent;

    // Adds the parent as "super" to the childConstructor.
    // Adding "super" to childConstructor.prototype leads to infinite recursion!
    // Using "super" minimizes the occurence of the parentConstructor name
    // in the block of code that defines the child. The unique occurence is
    // in the "inheritPrototype(childConstructor, parentConstructor)"
    // statement.
    childConstructor.super = parentConstructor.prototype;
}
//----------------------------------------------------------------------------
Baltek.Utils.Observable = function(){
    this.$init();
};

Baltek.Utils.inheritPrototype(Baltek.Utils.Observable, Object);

Baltek.Utils.Observable.prototype.$init = function(){
    this.observerCollection = [];
}

Baltek.Utils.Observable.prototype.notifyObservers = function(){
    var n = this.observerCollection.length;
    var i = 0;
    for (i=0; i < n ; i++){
        this.observerCollection[i].updateFromObservable(this);
    }
}

Baltek.Utils.Observable.prototype.registerObserver = function(observer){
    var observerIndex = this.observerCollection.indexOf(observer);
    if ( ! ( observerIndex > -1 ) ) {
        this.observerCollection.push(observer);
    }
}

Baltek.Utils.Observable.prototype.unregisterObserver = function(observer){
    var observerIndex = this.observerCollection.indexOf(observer);
    if ( observerIndex > -1 ) {
        this.observerCollection.splice(observerIndex, 1);
    }
}
//----------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
Baltek.View = { initCalled: false };
//----------------------------------------------------------------------------
Baltek.View.Element = function(id, i18nTranslater){
    this.$init(id, i18nTranslater);
};

Baltek.Utils.inheritPrototype(Baltek.View.Element, Baltek.Utils.Observable);

Baltek.View.Element.prototype.$init = function(id, i18nTranslater){
    Baltek.View.Element.super.$init.call(this);

    this.element = document.getElementById(id);

    this.i18nKeyPrefix = id;
    this.i18nTranslater = i18nTranslater;
    this.i18nTranslater.registerObserver(this);
}

Baltek.View.Element.prototype.enable = function(condition){
    Baltek.Utils.assert( condition === true || condition === false,
                            "Baltek.View.Element.prototype.enable(): condition" );

    this.element.disabled = ( ! condition );
}

Baltek.View.Element.prototype.getI18nValueForKeySuffix = function(i18nKeySuffix){
    var translatedText = this.i18nTranslater.getValueForKey( this.i18nKeyPrefix, i18nKeySuffix );
    return translatedText;
}

Baltek.View.Element.prototype.setBackgroundColor  = function(color){
    this.element.style.backgroundColor = color ;
}

Baltek.View.Element.prototype.setColor = function(color){
    this.element.style.color = color ;
}

Baltek.View.Element.prototype.show = function(condition){
    Baltek.Utils.assert( condition === true || condition === false, "Baltek.View.Element.prototype.show(): condition" );

    if ( condition ) {
        this.element.style.display = "inherit";
    } else {
        this.element.style.display = "none";
    }
}

Baltek.View.Element.prototype.updateFromI18n = function(){
    Baltek.Utils.assert( false, "Baltek.View.Element.prototype.updateFromI18n(): must not be called" );
}

Baltek.View.Element.prototype.updateFromObservable = function(observable){
    if ( observable === this.i18nTranslater ) {
        this.updateFromI18n();
    } else {
        Baltek.Utils.assert( false, "Baltek.View.Element.prototype.updateFromObservable(): observable not managed" );
    }
}
//----------------------------------------------------------------------------
Baltek.View.Button = function(id, i18nTranslater){
    this.$init(id, i18nTranslater);
};

Baltek.Utils.inheritPrototype(Baltek.View.Button, Baltek.View.Element);

Baltek.View.Button.prototype.$init = function(id, i18nTranslater){
    Baltek.View.FileButton.super.$init.call(this, id, i18nTranslater);

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.View.Button.prototype.updateFromI18n = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
}
//----------------------------------------------------------------------------
Baltek.View.FileButton = function(id, i18nTranslater){
    this.$init(id, i18nTranslater);
};

Baltek.Utils.inheritPrototype(Baltek.View.FileButton, Baltek.View.Element);

Baltek.View.FileButton.prototype.$init = function(id, i18nTranslater){
    Baltek.View.FileButton.super.$init.call(this, id, i18nTranslater);

    this.file = undefined;
    this.openedFile = undefined;
    this.window = null;

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.View.FileButton.prototype.openFile = function(){
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

Baltek.View.FileButton.prototype.updateFromI18n = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    this.file = this.getI18nValueForKeySuffix( "file" );
}
//----------------------------------------------------------------------------
Baltek.View.I18n = function(translations, fallbackLanguage){
    this.$init(translations, fallbackLanguage);
};

Baltek.Utils.inheritPrototype(Baltek.View.I18n, Baltek.Utils.Observable);

Baltek.View.I18n.prototype.$init = function(translations, fallbackLanguage){
    Baltek.View.I18n.super.$init.call(this);

    this.keySeparator = "_" ;

    this.translations = translations;
    this.availableLanguages = Baltek.Utils.getOwnProperties(this.translations);

    Baltek.Utils.assert( Baltek.Utils.hasValue(this.availableLanguages, fallbackLanguage),
                            "Baltek.View.I18n.prototype.$init(): fallbackLanguage");
    this.fallbackLanguage = fallbackLanguage ;

    this.language = this.getDefaultLanguage();
    if( ! Baltek.Utils.hasValue(this.availableLanguages, this.language) ) {
        this.language = this.fallbackLanguage;
    }
}

Baltek.View.I18n.prototype.getDefaultLanguage = function(){
    var languageTag = navigator.language;
    var languageSubTags = languageTag.split( '-' );
    var languagePrimarySubTag = languageSubTags[0];
    var defaultLanguage = languagePrimarySubTag;

    return defaultLanguage;
}

Baltek.View.I18n.prototype.getLanguage = function(){
    return this.language;
}

Baltek.View.I18n.prototype.getValueForKey = function(keyPrefix, keySuffix){
    var key = keyPrefix + this.keySeparator + keySuffix;

    Baltek.Utils.assert( this.translations[this.language].hasOwnProperty(key),
                            "Baltek.View.I18n.prototype.getValueForKey(): key");

    var value = this.translations[this.language][key];
    return value;
}

Baltek.View.I18n.prototype.setLanguage = function(language){
    Baltek.Utils.assert( Baltek.Utils.hasValue(this.availableLanguages, language),
                            "Baltek.View.I18n.prototype.setLanguage(): language");
    this.language = language;
    this.notifyObservers();
}
//----------------------------------------------------------------------------
Baltek.View.LanguageSelector = function(id, i18nTranslater){
    this.$init(id, i18nTranslater);
};

Baltek.Utils.inheritPrototype(Baltek.View.LanguageSelector, Baltek.View.Element);

Baltek.View.LanguageSelector.prototype.$init = function(id, i18nTranslater){
    Baltek.View.LanguageSelector.super.$init.call(this, id, i18nTranslater);
    this.createSelectorOptions();
}

Baltek.View.LanguageSelector.prototype.createSelectorOptions = function(){
    this.element.innerHTML = "" ;

    var n = this.i18nTranslater.availableLanguages.length;
    var i = 0;
    for (i=0; i < n ; i++) {
        var languageCode = this.i18nTranslater.availableLanguages[i];
        var languageName = this.i18nTranslater.translations[languageCode]["Baltek_ButtonZone_Language_name"];

        this.element.innerHTML +=
            "<option value=" + "\"" +  languageCode + "\"" + ">" + languageName + "</option>" ;
    }

    this.element.value = this.i18nTranslater.getLanguage();
}

Baltek.View.LanguageSelector.prototype.getSelection = function(){
    return this.element.value;
}

Baltek.View.LanguageSelector.prototype.updateFromI18n = function(){
    // Nothing to do.
}
//----------------------------------------------------------------------------
Baltek.View.Selector = function(id, i18nTranslater, values){
    this.$init(id, i18nTranslater, values);
};

Baltek.Utils.inheritPrototype(Baltek.View.Selector, Baltek.View.Element);

Baltek.View.Selector.prototype.$init = function(id, i18nTranslater, values){
    Baltek.View.Selector.super.$init.call(this, id, i18nTranslater);

    Baltek.Utils.assert( (values.length >= 2), "Baltek.View.Selector.prototype.$init(): values.length");
    this.values = values;

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.View.Selector.prototype.getSelection = function(){
    return this.element.value;
}

Baltek.View.Selector.prototype.updateFromI18n = function(){
    this.element.innerHTML = "" ;

    var n = this.values.length;
    var i = 0;
    for (i=0; i < n ; i++) {
        var value = this.values[i];
        var text = this.getI18nValueForKeySuffix(value);

        this.element.innerHTML +=
            "<option value=" + "\"" +  value + "\"" + ">" + text + "</option>" ;
    }
}
//----------------------------------------------------------------------------
Baltek.View.$init = function(){
    if ( ! Baltek.View.initCalled ) {
        Baltek.View.initCalled = true;

        Baltek.View.ButtonZone.$init();
        Baltek.View.CanvasZone.$init();

        Baltek.View.DebugZone.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.View.ButtonZone = { initCalled: false };

Baltek.View.ButtonZone.$init = function(){
    if ( ! Baltek.View.ButtonZone.initCalled ) {
        Baltek.View.ButtonZone.initCalled = true;

        var i18nTranslater = new Baltek.View.I18n(Baltek.View.I18n.translations , "fr");

        Baltek.View.ButtonZone.i18nTranslater = i18nTranslater;

        Baltek.View.ButtonZone.newGame = new Baltek.View.Button( "Baltek_ButtonZone_NewGame" , i18nTranslater);

        Baltek.View.ButtonZone.blueKind = new Baltek.View.Selector( "Baltek_ButtonZone_BlueKind", i18nTranslater,
                                                                    [ "human", "ai1", "ai2", "ai3" ] );

        Baltek.View.ButtonZone.redKind = new Baltek.View.Selector( "Baltek_ButtonZone_RedKind", i18nTranslater,
                                                                    [ "human", "ai1", "ai2", "ai3" ] );

        Baltek.View.ButtonZone.kickoff = new Baltek.View.Button( "Baltek_ButtonZone_Kickoff" , i18nTranslater);

        Baltek.View.ButtonZone.useBonus = new Baltek.View.Selector( "Baltek_ButtonZone_UseBonus", i18nTranslater,
                                                                    [ "no", "yes" ] );

        Baltek.View.ButtonZone.endTurn = new Baltek.View.Button( "Baltek_ButtonZone_EndTurn" , i18nTranslater);

        Baltek.View.ButtonZone.resumeGame = new Baltek.View.Button( "Baltek_ButtonZone_ResumeGame" , i18nTranslater );

        Baltek.View.ButtonZone.quitGame = new Baltek.View.Button( "Baltek_ButtonZone_QuitGame" , i18nTranslater);

        Baltek.View.ButtonZone.language = new Baltek.View.LanguageSelector( "Baltek_ButtonZone_Language" , i18nTranslater);

        Baltek.View.ButtonZone.coordinates = new Baltek.View.Selector( "Baltek_ButtonZone_Coordinates", i18nTranslater,
                                                                        [ "no", "yes" ] );

        Baltek.View.ButtonZone.rules = new Baltek.View.FileButton( "Baltek_ButtonZone_Rules" , i18nTranslater);

        Baltek.View.ButtonZone.help = new Baltek.View.FileButton( "Baltek_ButtonZone_Help" , i18nTranslater);

        Baltek.View.ButtonZone.about = new Baltek.View.FileButton( "Baltek_ButtonZone_About" , i18nTranslater);
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.View.CanvasZone = { initCalled: false };

Baltek.View.CanvasZone.$init = function(){
    if ( ! Baltek.View.CanvasZone.initCalled ) {
        Baltek.View.CanvasZone.initCalled = true;
        Baltek.View.CanvasZone.canvas = document.getElementById( "Baltek_CanvasZone_Canvas" );
        Baltek.View.CanvasZone.rectangle = Baltek.View.CanvasZone.canvas.getBoundingClientRect();
        Baltek.View.CanvasZone.drawer = Baltek.View.CanvasZone.canvas.getContext( "2d" );
    }
}

Baltek.View.CanvasZone.getMousePosition = function(event){
    return {
      x: event.clientX + window.pageXOffset - Baltek.View.CanvasZone.rectangle.left,
      y: event.clientY + window.pageYOffset - Baltek.View.CanvasZone.rectangle.top
    };
}
///////////////////////////////////////////////////////////////////////////////
Baltek.View.DebugZone = { initCalled: false };

Baltek.View.DebugZone.$init = function(){
    if ( ! Baltek.View.DebugZone.initCalled ) {
        Baltek.View.DebugZone.initCalled = true;

        Baltek.View.DebugZone.isEnabled = ( document.getElementById( "Baltek_DebugZone" ) !== null ) ;
        Baltek.View.DebugZone.messages = document.getElementById( "Baltek_DebugZone_Messages" );
        Baltek.View.DebugZone.mousePosition = document.getElementById( "Baltek_DebugZone_Mouse" );

        if ( Baltek.View.DebugZone.isEnabled ) {
            Baltek.View.CanvasZone.canvas.addEventListener('mousemove',
                function(event){
                    var mousePosition = Baltek.View.CanvasZone.getMousePosition(event);
                    Baltek.View.DebugZone.mousePosition.innerHTML = "Mouse(x,y) = (" +
                        Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                        + ")" ;
                },
                false);
        }

        Baltek.View.DebugZone.writeMessage( "Baltek.View.DebugZone.$init(): Ready to debug." );
        Baltek.View.DebugZone.writeMessage( "Baltek.View.DebugZone.$init(): Do you see these 2 lines?" );
    }
}

Baltek.View.DebugZone.clearMessages = function(){
    if ( Baltek.View.DebugZone.isEnabled ) {
        Baltek.View.DebugZone.messages.innerHTML = "" ;
    }
}

Baltek.View.DebugZone.enable = function(){
    Baltek.View.DebugZone.writeMessage( "Enable");
    Baltek.View.ButtonZone.newGame.enable(true);
}

Baltek.View.DebugZone.disable = function(){
    Baltek.View.DebugZone.writeMessage( "Disable");
    Baltek.View.ButtonZone.newGame.enable(false);
}

Baltek.View.DebugZone.hide = function(){
    Baltek.View.DebugZone.writeMessage( "Hide");
    Baltek.View.ButtonZone.newGame.show(false);
}

Baltek.View.DebugZone.show = function(){
    Baltek.View.DebugZone.writeMessage( "Show");
    Baltek.View.ButtonZone.newGame.show(true);
    Baltek.View.ButtonZone.newGame.setColor( "white" );
    Baltek.View.ButtonZone.newGame.setBackgroundColor( "blue" );
}

Baltek.View.DebugZone.writeMessage = function(text){
    if ( Baltek.View.DebugZone.isEnabled ) {
        Baltek.View.DebugZone.messages.innerHTML += "<li>" + text + "</li>" ;
    }
}
///////////////////////////////////////////////////////////////////////////////
//----------------------------------------------------------------------------
Baltek.Presenter = function(){
    this.$init();
};

Baltek.Utils.inheritPrototype(Baltek.Presenter, Object);

Baltek.Presenter.prototype.$init = function(){
    this.i18nTranslater =  Baltek.View.ButtonZone.i18nTranslater ;

    this.newGame = Baltek.View.ButtonZone.newGame;
    this.newGame.registerObserver(this);

    this.language = Baltek.View.ButtonZone.language;
    this.language.registerObserver(this);
}

Baltek.Presenter.prototype.updateFromNewGame = function(){
    Baltek.View.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromNewGame: " +
                                        this.newGame.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromLanguage = function(){
    this.i18nTranslater.setLanguage(this.language.getSelection());

    Baltek.View.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromLanguage: " +
                                        this.language.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromObservable = function(observable){
    if ( observable === this.newGame ) {
        this.updateFromNewGame();

    } else if ( observable === this.language ) {
        this.updateFromLanguage();
        
    } else {
        Baltek.Utils.assert( false, "Baltek.Presenter.prototype.updateFromObservable(): observable not managed" );
    }
}
//----------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
