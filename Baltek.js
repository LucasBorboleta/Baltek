"use strict";
///////////////////////////////////////////////////////////////////////////////
var Baltek = { initCalled: false };

Baltek.$init = function(){
    if ( ! Baltek.initCalled ) {
        Baltek.initCalled = true;

        Baltek.Utils.$init();
        Baltek.CanvasZone.$init();
        Baltek.presenter = new Baltek.Presenter();
        Baltek.DebugZone.$init();

        Baltek.DebugZone.writeMessage( "Baltek.$init(): done" );
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
        Baltek.DebugZone.writeMessage(text);
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
///////////////////////////////////////////////////////////////////////////////
Baltek.Observable = function(){
    this.$init();
};

Baltek.Utils.inheritPrototype(Baltek.Observable, Object);

Baltek.Observable.prototype.$init = function(){
    this.observerCollection = [];
}

Baltek.Observable.prototype.notifyObservers = function(){
    var n = this.observerCollection.length;
    var i = 0;
    for (i=0; i < n ; i++){
        this.observerCollection[i].updateFromObservable(this);
    }
}

Baltek.Observable.prototype.registerObserver = function(observer){
    var observerIndex = this.observerCollection.indexOf(observer);
    if ( ! ( observerIndex > -1 ) ) {
        this.observerCollection.push(observer);
    }
}

Baltek.Observable.prototype.unregisterObserver = function(observer){
    var observerIndex = this.observerCollection.indexOf(observer);
    if ( observerIndex > -1 ) {
        this.observerCollection.splice(observerIndex, 1);
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.I18nator = function(translations, fallbackLanguage){
    this.$init(translations, fallbackLanguage);
};

Baltek.Utils.inheritPrototype(Baltek.I18nator, Baltek.Observable);

Baltek.I18nator.prototype.$init = function(translations, fallbackLanguage){
    Baltek.I18nator.super.$init.call(this);

    this.keySeparator = "_" ;

    this.translations = translations;
    this.availableLanguages = Baltek.Utils.getOwnProperties(this.translations);

    Baltek.Utils.assert( Baltek.Utils.hasValue(this.availableLanguages, fallbackLanguage),
                         "Baltek.I18nator.prototype.$init(): fallbackLanguage");
    this.fallbackLanguage = fallbackLanguage ;

    this.language = this.getDefaultLanguage();
    if( ! Baltek.Utils.hasValue(this.availableLanguages, this.language) ) {
        this.language = this.fallbackLanguage;
    }
}

Baltek.I18nator.prototype.getAvailableLanguages = function(){
    return this.availableLanguages;
}

Baltek.I18nator.prototype.getDefaultLanguage = function(){
    var languageTag = navigator.language;
    var languageSubTags = languageTag.split( '-' );
    var languagePrimarySubTag = languageSubTags[0];
    var defaultLanguage = languagePrimarySubTag;

    return defaultLanguage;
}

Baltek.I18nator.prototype.getLanguage = function(){
    return this.language;
}

Baltek.I18nator.prototype.getValueForKey = function(i18nKeyPrefix, i18nKeySuffix){
    var i18nKey = i18nKeyPrefix + this.keySeparator + i18nKeySuffix;

    Baltek.Utils.assert( this.translations[this.language].hasOwnProperty(i18nKey),
                         "Baltek.I18nator.prototype.getValueForKey(): i18nKey");

    var value = this.translations[this.language][i18nKey];
    return value;
}

Baltek.I18nator.prototype.setLanguage = function(language){
    Baltek.Utils.assert( Baltek.Utils.hasValue(this.availableLanguages, language),
                         "Baltek.I18nator.prototype.setLanguage(): language");
    this.language = language;
    this.notifyObservers();
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Widget = function(id, i18nator){
    this.$init(id, i18nator);
};

Baltek.Utils.inheritPrototype(Baltek.Widget, Baltek.Observable);

Baltek.Widget.prototype.$init = function(id, i18nator){
    Baltek.Widget.super.$init.call(this);

    this.element = document.getElementById(id);

    this.i18nKeyPrefix = id;
    this.i18nator = i18nator;
    this.i18nator.registerObserver(this);
}

Baltek.Widget.prototype.enable = function(condition){
    Baltek.Utils.assert( condition === true || condition === false,
                         "Baltek.Widget.prototype.enable(): condition" );

    this.element.disabled = ( ! condition );
}

Baltek.Widget.prototype.getI18nValueForKeySuffix = function(i18nKeySuffix){
    var translatedText = this.i18nator.getValueForKey( this.i18nKeyPrefix, i18nKeySuffix );
    return translatedText;
}

Baltek.Widget.prototype.setBackgroundColor  = function(color){
    this.element.style.backgroundColor = color ;
}

Baltek.Widget.prototype.setColor = function(color){
    this.element.style.color = color ;
}

Baltek.Widget.prototype.show = function(condition){
    Baltek.Utils.assert( condition === true || condition === false,
                         "Baltek.Widget.prototype.show(): condition" );

    if ( condition ) {
        this.element.style.display = "inherit";
    } else {
        this.element.style.display = "none";
    }
}

Baltek.Widget.prototype.updateFromI18n = function(){
    Baltek.Utils.assert( false, "Baltek.Widget.prototype.updateFromI18n(): must not be called" );
}

Baltek.Widget.prototype.updateFromObservable = function(observable){
    if ( observable === this.i18nator ) {
        this.updateFromI18n();
    } else {
        Baltek.Utils.assert( false,
                             "Baltek.Widget.prototype.updateFromObservable(): observable not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Button = function(id, i18nator){
    this.$init(id, i18nator);
};

Baltek.Utils.inheritPrototype(Baltek.Button, Baltek.Widget);

Baltek.Button.prototype.$init = function(id, i18nator){
    Baltek.FileButton.super.$init.call(this, id, i18nator);

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.Button.prototype.updateFromI18n = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Selector = function(id, i18nator, values){
    this.$init(id, i18nator, values);
};

Baltek.Utils.inheritPrototype(Baltek.Selector, Baltek.Widget);

Baltek.Selector.prototype.$init = function(id, i18nator, values){
    Baltek.Selector.super.$init.call(this, id, i18nator);

    Baltek.Utils.assert( (values.length >= 2), "Baltek.Selector.prototype.$init(): values.length");
    this.values = values;

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.Selector.prototype.getSelection = function(){
    return this.element.value;
}

Baltek.Selector.prototype.setSelection = function(selection){
    Baltek.Utils.assert( Baltek.Utils.hasValue(this.values, selection),
                         "Baltek.Selector.prototype.setSelection(): selection");
    this.element.value = selection;
}

Baltek.Selector.prototype.updateFromI18n = function(){
    var selection = this.element.value;
    if ( selection === undefined || this.element.value === "" ) {
        selection = this.values[0];
    }

    this.element.innerHTML = "" ;

    var n = this.values.length;
    var i = 0;
    for (i=0; i < n ; i++) {
        var value = this.values[i];
        var text = this.getI18nValueForKeySuffix(value);

        this.element.innerHTML +=
            "<option value=" + "\"" +  value + "\"" + ">" + text + "</option>" ;
    }

    this.element.value = selection;
}
///////////////////////////////////////////////////////////////////////////////
Baltek.FileButton = function(id, i18nator){
    this.$init(id, i18nator);
};

Baltek.Utils.inheritPrototype(Baltek.FileButton, Baltek.Widget);

Baltek.FileButton.prototype.$init = function(id, i18nator){
    Baltek.FileButton.super.$init.call(this, id, i18nator);

    this.file = undefined;
    this.openedFile = undefined;
    this.window = null;

    // Finalize the construction regarding I18n.
    this.updateFromI18n();
}

Baltek.FileButton.prototype.openFile = function(){
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

Baltek.FileButton.prototype.updateFromI18n = function(){
    this.element.innerHTML = this.getI18nValueForKeySuffix( "button" );
    this.file = this.getI18nValueForKeySuffix( "file" );
}
///////////////////////////////////////////////////////////////////////////////
Baltek.CanvasZone = { initCalled: false };

Baltek.CanvasZone.$init = function(){
    if ( ! Baltek.CanvasZone.initCalled ) {
        Baltek.CanvasZone.initCalled = true;
        Baltek.CanvasZone.canvas = document.getElementById( "Baltek_CanvasZone_Canvas" );
        Baltek.CanvasZone.rectangle = Baltek.CanvasZone.canvas.getBoundingClientRect();
        Baltek.CanvasZone.drawer = Baltek.CanvasZone.canvas.getContext( "2d" );
    }
}

Baltek.CanvasZone.getMousePosition = function(event){
    return {
      x: event.clientX + window.pageXOffset - Baltek.CanvasZone.rectangle.left,
      y: event.clientY + window.pageYOffset - Baltek.CanvasZone.rectangle.top
    };
}
///////////////////////////////////////////////////////////////////////////////
Baltek.DebugZone = { initCalled: false };

Baltek.DebugZone.$init = function(){
    if ( ! Baltek.DebugZone.initCalled ) {
        Baltek.DebugZone.initCalled = true;

        Baltek.DebugZone.isEnabled = ( document.getElementById( "Baltek_DebugZone" ) !== null ) ;
        Baltek.DebugZone.messages = document.getElementById( "Baltek_DebugZone_Messages" );
        Baltek.DebugZone.mousePosition = document.getElementById( "Baltek_DebugZone_Mouse" );

        if ( Baltek.DebugZone.isEnabled ) {

            Baltek.CanvasZone.canvas.addEventListener('mousemove',
                function(event){
                    var mousePosition = Baltek.CanvasZone.getMousePosition(event);
                    Baltek.DebugZone.mousePosition.innerHTML = "Mouse(x,y) = (" +
                        Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                        + ")" ;
                },
                false);
        }

        Baltek.DebugZone.writeMessage( "Baltek.DebugZone.$init(): Ready to debug." );
        Baltek.DebugZone.writeMessage( "Baltek.DebugZone.$init(): Do you see these 2 lines?" );
    }
}

Baltek.DebugZone.clearMessages = function(){
    if ( Baltek.DebugZone.isEnabled ) {
        Baltek.DebugZone.messages.innerHTML = "" ;
    }
}

Baltek.DebugZone.enable = function(){
    Baltek.DebugZone.writeMessage( "Enable");
    Baltek.presenter.startGame.enable(true);
}

Baltek.DebugZone.disable = function(){
    Baltek.DebugZone.writeMessage( "Disable");
    Baltek.presenter.startGame.enable(false);
}

Baltek.DebugZone.hide = function(){
    Baltek.DebugZone.writeMessage( "Hide");
    Baltek.presenter.startGame.show(false);
}

Baltek.DebugZone.show = function(){
    Baltek.DebugZone.writeMessage( "Show");
    Baltek.presenter.startGame.show(true);
    Baltek.presenter.startGame.setColor( "white" );
    Baltek.presenter.startGame.setBackgroundColor( "blue" );
}

Baltek.DebugZone.writeMessage = function(text){
    if ( Baltek.DebugZone.isEnabled ) {
        Baltek.DebugZone.messages.innerHTML = "<li>" + text + "</li>" +
                                              Baltek.DebugZone.messages.innerHTML;
    }
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Presenter = function(){
    this.$init();
};

Baltek.Utils.inheritPrototype(Baltek.Presenter, Object);

Baltek.Presenter.prototype.$init = function(){
    this.i18nator = new Baltek.I18nator(Baltek.I18nTranslations, "fr");

    this.startGame = new Baltek.Button( "Baltek_ButtonZone_StartGame" , this.i18nator);
    this.startGame.registerObserver(this);

    this.restartGame = new Baltek.Button( "Baltek_ButtonZone_RestartGame" , this.i18nator);
    this.restartGame.registerObserver(this);

    this.resumeGame = new Baltek.Button( "Baltek_ButtonZone_ResumeGame" , this.i18nator );
    this.resumeGame.registerObserver(this);

    this.quitGame = new Baltek.Button( "Baltek_ButtonZone_QuitGame" , this.i18nator);
    this.quitGame.registerObserver(this);

    this.blueKind = new Baltek.Selector( "Baltek_ButtonZone_BlueKind", this.i18nator,
                                         [ "human", "ai1", "ai2", "ai3" ] );
    this.blueKind.registerObserver(this);

    this.redKind = new Baltek.Selector( "Baltek_ButtonZone_RedKind", this.i18nator,
                                        [ "human", "ai1", "ai2", "ai3" ] );
    this.redKind.registerObserver(this);

    this.kickoff = new Baltek.Button( "Baltek_ButtonZone_Kickoff" , this.i18nator);
    this.kickoff.registerObserver(this);

    this.useBonus = new Baltek.Selector( "Baltek_ButtonZone_UseBonus", this.i18nator,
                                         [ "no", "yes" ] );
    this.useBonus.registerObserver(this);

    this.endTurn = new Baltek.Button( "Baltek_ButtonZone_EndTurn" , this.i18nator);
    this.endTurn.registerObserver(this);

    this.language = new Baltek.Selector( "Baltek_ButtonZone_Language", this.i18nator,
                                         this.i18nator.getAvailableLanguages() );
    this.language.registerObserver(this);
    this.language.setSelection(this.i18nator.getLanguage());

    this.coordinates = new Baltek.Selector( "Baltek_ButtonZone_Coordinates", this.i18nator,
                                             [ "no", "yes" ] );
    this.coordinates.registerObserver(this);

    this.rules = new Baltek.FileButton( "Baltek_ButtonZone_Rules" , this.i18nator);
    //this.rules.registerObserver(this);

    this.help = new Baltek.FileButton( "Baltek_ButtonZone_Help" , this.i18nator);
    //this.help.registerObserver(this);

    this.about = new Baltek.FileButton( "Baltek_ButtonZone_About" , this.i18nator);
    //this.about.registerObserver(this);

    this.defineStates();
    this.initState();
    this.updateState();
}

Baltek.Presenter.prototype.defineStates = function(){
    this.GAME_IS_READY_TO_START = 1000;
    this.GAME_IS_RUNNING = 2000;
    this.GAME_IS_READY_TO_QUIT = 3000;
    this.GAME_IS_FINISHED = 4000;
}

Baltek.Presenter.prototype.initState = function(){

    this.gameState = this.GAME_IS_READY_TO_START;

    this.state = {};

    this.state.blueGoals = 0;
    this.state.redGoals = 0;

    this.state.isBlueToMove = true;
    this.state.isRedToMove = false;

    this.state.blueUsedBonus = false;
    this.state.redUsedBonus = false;

    this.state.newGameHasBeenStarted = false;

    this.state.newSetHasBeenStarted = false;
}

Baltek.Presenter.prototype.updateState = function(){
    this.hideAllGameButtons();
    this.disableAllGameButtons();

    if ( this.gameState === this.GAME_IS_READY_TO_START ) {
        this.startGame.show(true);
        this.blueKind.show(true);
        this.redKind.show(true);

        this.startGame.enable(true);
        this.blueKind.enable(true);
        this.redKind.enable(true);

    } else if ( this.gameState === this.GAME_IS_RUNNING ) {
        this.quitGame.show(true);
        this.blueKind.show(true);
        this.redKind.show(true);

        this.quitGame.enable(true);

    } else if ( this.gameState === this.GAME_IS_READY_TO_QUIT ) {
        this.resumeGame.show(true);
        this.quitGame.show(true);
        this.blueKind.show(true);
        this.redKind.show(true);

        this.resumeGame.enable(true);
        this.quitGame.enable(true);

    } else if ( this.gameState === this.GAME_IS_FINISHED ) {
        this.restartGame.show(true);
        this.blueKind.show(true);
        this.redKind.show(true);

        this.restartGame.enable(true);

    } else {
        Baltek.Utils.assert( false, "Baltek.Presenter.prototype.updateState(): this.gameState" );
    }
}

Baltek.Presenter.prototype.hideAllGameButtons = function(){
    this.restartGame.show(false);
    this.startGame.show(false);
    this.blueKind.show(false);
    this.redKind.show(false);
    this.kickoff.show(false);
    this.useBonus.show(false);
    this.endTurn.show(false);
    this.resumeGame.show(false);
    this.quitGame.show(false);
}

Baltek.Presenter.prototype.disableAllGameButtons = function(){
    this.restartGame.enable(false);
    this.startGame.enable(false);
    this.blueKind.enable(false);
    this.redKind.enable(false);
    this.kickoff.enable(false);
    this.useBonus.enable(false);
    this.endTurn.enable(false);
    this.resumeGame.enable(false);
    this.quitGame.enable(false);
}

Baltek.Presenter.prototype.updateFromStartGame = function(){
    Baltek.Utils.assert( this.gameState === this.GAME_IS_READY_TO_START,
                         "Baltek.Presenter.prototype.updateFromStartGame(): this.gameState" );
    this.state.blueKind = this.blueKind.getSelection();
    this.state.redKind = this.redKind.getSelection();
    this.gameState = this.GAME_IS_RUNNING;
    this.updateState();
}

Baltek.Presenter.prototype.updateFromRestartGame = function(){
    Baltek.Utils.assert( this.gameState === this.GAME_IS_FINISHED,
                         "Baltek.Presenter.prototype.updateFromRestartGame(): this.gameState" );
    this.gameState = this.GAME_IS_READY_TO_START;
    this.updateState();
}

Baltek.Presenter.prototype.updateFromResumeGame = function(){
    Baltek.Utils.assert( this.gameState === this.GAME_IS_READY_TO_QUIT,
                        "Baltek.Presenter.prototype.updateFromResumeGame(): this.gameState" );
    this.gameState = this.GAME_IS_RUNNING;
    this.updateState();
}

Baltek.Presenter.prototype.updateFromQuitGame = function(){
    if ( this.gameState === this.GAME_IS_RUNNING ) {
        this.gameState = this.GAME_IS_READY_TO_QUIT;

    } else if ( this.gameState === this.GAME_IS_READY_TO_QUIT ) {
        this.gameState = this.GAME_IS_FINISHED;

    } else {
        Baltek.Utils.assert( false,
                            "Baltek.Presenter.prototype.updateFromResumeGame(): this.gameState" );
    }
    this.updateState();
}

Baltek.Presenter.prototype.updateFromBlueKind = function(){
    Baltek.Utils.assert( this.gameState === this.GAME_IS_READY_TO_START,
                         "Baltek.Presenter.prototype.updateFromBlueKind(): this.gameState" );
    this.state.blueKind = this.blueKind.getSelection();
}

Baltek.Presenter.prototype.updateFromRedKind = function(){
    Baltek.Utils.assert( this.gameState === this.GAME_IS_READY_TO_START,
                         "Baltek.Presenter.prototype.updateFromRedKind(): this.gameState" );
    this.state.redKind = this.redKind.getSelection();
}

Baltek.Presenter.prototype.updateFromKickoff = function(){
    Baltek.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromKickoff: " +
                                        this.kickoff.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromUseBonus = function(){
    Baltek.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromUseBonus: " +
                                        this.useBonus.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromEndTurn = function(){
    Baltek.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromEndTurn: " +
                                        this.endTurn.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromLanguage = function(){
    this.i18nator.setLanguage(this.language.getSelection());
}

Baltek.Presenter.prototype.updateFromCoordinates = function(){
    Baltek.DebugZone.writeMessage( "Baltek.Presenter.prototype.updateFromCoordinates: " +
                                        this.coordinates.element.id + " has notified me." );
}

Baltek.Presenter.prototype.updateFromObservable = function(observable){
    if ( observable === this.startGame ) {
        this.updateFromStartGame();

    } else if ( observable === this.restartGame ) {
        this.updateFromRestartGame();

    } else if ( observable === this.resumeGame ) {
        this.updateFromResumeGame();

    } else if ( observable === this.quitGame ) {
        this.updateFromQuitGame();

    } else if ( observable === this.blueKind ) {
        this.updateFromBlueKind();

    } else if ( observable === this.redKind ) {
        this.updateFromRedKind();

    } else if ( observable === this.kickoff ) {
        this.updateFromKickoff();

    } else if ( observable === this.useBonus ) {
        this.updateFromUseBonus();

    } else if ( observable === this.endTurn ) {
        this.updateFromEndTurn();

    } else if ( observable === this.language ) {
        this.updateFromLanguage();

    } else if ( observable === this.coordinates ) {
        this.updateFromCoordinates();

    } else {
        Baltek.Utils.assert( false, "Baltek.Presenter.prototype.updateFromObservable(): observable not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
