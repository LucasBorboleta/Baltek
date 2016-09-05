"use strict";
///////////////////////////////////////////////////////////////////////////////
var Baltek = { initCalled: false };

Baltek.$init = function(){
    if ( ! Baltek.initCalled ) {
        Baltek.initCalled = true;

        Baltek.Utils.$init();
        Baltek.View.$init();

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
    var p;
    for (p in anObject) {
        if ( anObject.hasOwnProperty(p) ) {
            properties.push(p);
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
Baltek.View = { initCalled: false };
//----------------------------------------------------------------------------
Baltek.View.Element = function(id){
    this.$init(id);
};

Baltek.Utils.inheritPrototype(Baltek.View.Element, Object)

Baltek.View.Element.prototype.$init = function(id){
    this.element = document.getElementById(id);

    this.i18nKeyPrefix = id;
    this.i18nManager = Baltek.View.I18n;

    var thisSaved = this;
    var listner = function (){ thisSaved.changeI18n(); };
    this.i18nManager.addListener(listner);
}

Baltek.View.Element.prototype.changeI18n = function(){
    Baltek.Utils.assert( false, "Baltek.View.Element.prototype.changeI18n(): must not be called" );
}

Baltek.View.Element.prototype.enable = function(condition){
    Baltek.Utils.assert( condition === true || condition === false, "Baltek.View.Element.prototype.enable(): condition" );

    this.element.disabled = ( ! condition );
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
//----------------------------------------------------------------------------
Baltek.View.Button = function(id){
    this.$init(id);
};

Baltek.Utils.inheritPrototype(Baltek.View.Button, Baltek.View.Element)

Baltek.View.Button.prototype.$init = function(id){
    Baltek.View.FileButton.super.$init.call(this,id);

    // Finalize the construction regarding I18n.
    this.changeI18n();
}

Baltek.View.Button.prototype.changeI18n = function(){
    this.element.innerHTML = this.i18nManager.getText( this.i18nKeyPrefix + "_button" );
}

Baltek.View.Button.prototype.onclick = function(){
    Baltek.View.DebugZone.writeMessage( "Baltek.View.Button.onclick(): " +
                                        this.element.id + " clicked." );
}
//----------------------------------------------------------------------------
Baltek.View.FileButton = function(id){
    this.$init(id);
};

Baltek.Utils.inheritPrototype(Baltek.View.FileButton, Baltek.View.Element)

Baltek.View.FileButton.prototype.changeI18n = function(){
    this.element.innerHTML = this.i18nManager.getText( this.i18nKeyPrefix + "_button" );
    this.file = this.i18nManager.getText( this.i18nKeyPrefix + "_file" );
}

Baltek.View.FileButton.prototype.$init = function(id){
    Baltek.View.FileButton.super.$init.call(this,id);

    this.file = undefined;
    this.openedFile = undefined;
    this.window = null;

    // Finalize the construction regarding I18n.
    this.changeI18n();
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
//----------------------------------------------------------------------------
Baltek.View.LanguageSelector = function(id){
    this.$init(id);
};

Baltek.Utils.inheritPrototype(Baltek.View.LanguageSelector, Baltek.View.Element)

Baltek.View.LanguageSelector.prototype.$init = function(id){
    Baltek.View.LanguageSelector.super.$init.call(this,id);
    this.createSelectorOptions();
}

Baltek.View.LanguageSelector.prototype.change = function(){
    this.i18nManager.setLanguage(this.element.value);
}

Baltek.View.LanguageSelector.prototype.changeI18n = function(){
    // Nothing to do.
}

Baltek.View.LanguageSelector.prototype.createSelectorOptions = function(){
    this.element.innerHTML = "" ;

    var n = this.i18nManager.availableLanguages.length;
    var i = 0;
    for (i=0; i < n ; i++) {
        var languageCode = this.i18nManager.availableLanguages[i];
        var languageName = this.i18nManager.translations[languageCode]["Baltek_ButtonZone_Language_name"];

        this.element.innerHTML +=
            "<option value=" + "\"" +  languageCode + "\"" + ">" + languageName + "</option>" ;
    }

    this.element.value = this.i18nManager.getLanguage();
}
//----------------------------------------------------------------------------
Baltek.View.Selector = function(id, values){
    this.$init(id, values);
};

Baltek.Utils.inheritPrototype(Baltek.View.Selector, Baltek.View.Element)

Baltek.View.Selector.prototype.$init = function(id, values){
    Baltek.View.Selector.super.$init.call(this,id);

    Baltek.Utils.assert( (values.length >= 2), "Baltek.View.Selector.prototype.$init(): values.length");
    this.values = values;
    this.selection = values[0];

    // Finalize the construction regarding I18n.
    this.changeI18n();
}

Baltek.View.Selector.prototype.change = function(){
    this.selection = this.element.value;
    Baltek.View.DebugZone.writeMessage( "Baltek.View.Selector.change(): " +
                                        this.element.id + ".selection = " + this.selection);
}

Baltek.View.Selector.prototype.changeI18n = function(){
    this.element.innerHTML = "" ;

    var n = this.values.length;
    var i = 0;
    for (i=0; i < n ; i++) {
        var value = this.values[i];
        var text = this.i18nManager.getText( this.i18nKeyPrefix + "_" + value );

        this.element.innerHTML +=
            "<option value=" + "\"" +  value + "\"" + ">" + text + "</option>" ;
    }

    this.element.value = this.selection;
}
//----------------------------------------------------------------------------
Baltek.View.$init = function(){
    if ( ! Baltek.View.initCalled ) {
        Baltek.View.initCalled = true;

        Baltek.View.I18n.$init();

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

        Baltek.View.ButtonZone.newGame = new Baltek.View.Button( "Baltek_ButtonZone_NewGame" );

        Baltek.View.ButtonZone.blueKind = new Baltek.View.Selector( "Baltek_ButtonZone_BlueKind",
                                                                    [ "human", "ai1", "ai2", "ai3" ] );

        Baltek.View.ButtonZone.redKind = new Baltek.View.Selector( "Baltek_ButtonZone_RedKind",
                                                                    [ "human", "ai1", "ai2", "ai3" ] );

        Baltek.View.ButtonZone.kickoff = new Baltek.View.Button( "Baltek_ButtonZone_Kickoff" );

        Baltek.View.ButtonZone.useBonus = new Baltek.View.Selector( "Baltek_ButtonZone_UseBonus",
                                                                    [ "no", "yes" ] );

        Baltek.View.ButtonZone.endTurn = new Baltek.View.Button( "Baltek_ButtonZone_EndTurn" );

        Baltek.View.ButtonZone.resumeGame = new Baltek.View.Button( "Baltek_ButtonZone_ResumeGame" );

        Baltek.View.ButtonZone.quitGame = new Baltek.View.Button( "Baltek_ButtonZone_QuitGame" );

        Baltek.View.ButtonZone.language = new Baltek.View.LanguageSelector( "Baltek_ButtonZone_Language");

        Baltek.View.ButtonZone.coordinates = new Baltek.View.Selector( "Baltek_ButtonZone_Coordinates",
                                                                        [ "no", "yes" ] );

        Baltek.View.ButtonZone.rules = new Baltek.View.FileButton( "Baltek_ButtonZone_Rules" );

        Baltek.View.ButtonZone.help = new Baltek.View.FileButton( "Baltek_ButtonZone_Help" );

        Baltek.View.ButtonZone.about = new Baltek.View.FileButton( "Baltek_ButtonZone_About" );
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
Baltek.View.I18n = { initCalled: false };

Baltek.View.I18n.$init = function(){
    if ( ! Baltek.View.I18n.initCalled ) {
        Baltek.View.I18n.initCalled = true;

        Baltek.View.I18n.availableLanguages = Baltek.Utils.getOwnProperties(Baltek.View.I18n.translations);

        Baltek.View.I18n.fallbackLanguage = "fr" ;
        Baltek.Utils.assert( Baltek.Utils.hasValue(Baltek.View.I18n.availableLanguages, Baltek.View.I18n.fallbackLanguage),
                                "Baltek.View.I18n.$init(): fallbackLanguage");

        Baltek.View.I18n.language = Baltek.View.I18n.getDefaultLanguage();
        if( ! Baltek.Utils.hasValue(Baltek.View.I18n.availableLanguages, Baltek.View.I18n.language) ) {
            Baltek.View.I18n.language = Baltek.View.I18n.fallbackLanguage;
        }

        Baltek.View.I18n.listners = [];
    }
}

Baltek.View.I18n.addListener = function(listner){
    Baltek.View.I18n.listners.push(listner);
}

Baltek.View.I18n.callListners = function(){
    var n = Baltek.View.I18n.listners.length;
    var i = 0;
    for (i=0; i < n ; i++){
        Baltek.View.I18n.listners[i]();
    }
}

Baltek.View.I18n.getDefaultLanguage = function(){
    var languageTag = navigator.language;
    var languageSubTags = languageTag.split( '-' );
    var languagePrimarySubTag = languageSubTags[0];
    var defaultLanguage = languagePrimarySubTag;

    return defaultLanguage;
}

Baltek.View.I18n.getLanguage = function(){
    return Baltek.View.I18n.language;
}

Baltek.View.I18n.getText = function(key){
    Baltek.Utils.assert( Baltek.View.I18n.translations[Baltek.View.I18n.language].hasOwnProperty(key),
                            "Baltek.View.I18n.getText(): key");

    var text = Baltek.View.I18n.translations[Baltek.View.I18n.language][key];
    return text;
}

Baltek.View.I18n.setLanguage = function(language){
    Baltek.Utils.assert( Baltek.Utils.hasValue(Baltek.View.I18n.availableLanguages, language),
                            "Baltek.View.I18n.setLanguage(): language");
    Baltek.View.I18n.language = language;
    Baltek.View.I18n.callListners();
}

Baltek.View.I18n.translations = {};

Baltek.View.I18n.translations.eo = {
    "Baltek_ButtonZone_About_button"      : "Pri" ,
    "Baltek_ButtonZone_About_file"        : "./lang/eo/Baltek-about-eo.html" ,

    "Baltek_ButtonZone_BlueKind_human"    : "Homo" ,
    "Baltek_ButtonZone_BlueKind_ai1"      : "*(eo)AI1" ,
    "Baltek_ButtonZone_BlueKind_ai2"      : "*(eo)AI2" ,
    "Baltek_ButtonZone_BlueKind_ai3"      : "*(eo)AI3" ,

    "Baltek_ButtonZone_Coordinates_no"    : "Koordinatoj: ne",
    "Baltek_ButtonZone_Coordinates_yes"   : "Koordinatoj: jes",

    "Baltek_ButtonZone_EndTurn_button"    : "*(eo)End my turn" ,

    "Baltek_ButtonZone_Help_button"       : "Helpo" ,
    "Baltek_ButtonZone_Help_file"         : "./lang/eo/Baltek-help-eo.html" ,

    "Baltek_ButtonZone_Kickoff_button"    : "*(eo)Kickoff" ,

    "Baltek_ButtonZone_Language_name"     : "Esperanto" ,

    "Baltek_ButtonZone_NewGame_button"    : "*(eo)New game" ,

    "Baltek_ButtonZone_QuitGame_button"   : "*(eo)Quit game" ,

    "Baltek_ButtonZone_RedKind_human"     : "Homo" ,
    "Baltek_ButtonZone_RedKind_ai1"       : "*(eo)AI1" ,
    "Baltek_ButtonZone_RedKind_ai2"       : "*(eo)AI2" ,
    "Baltek_ButtonZone_RedKind_ai3"       : "*(eo)AI3" ,

    "Baltek_ButtonZone_ResumeGame_button" : "*(eo)Resume game" ,

    "Baltek_ButtonZone_Rules_button"      : "Reguloj" ,
    "Baltek_ButtonZone_Rules_file"        : "./lang/eo/Baltek-rules-eo.html",

    "Baltek_ButtonZone_UseBonus_no"       : "*(eo)Use my bonus: ne",
    "Baltek_ButtonZone_UseBonus_yes"      : "*(eo)Use my bonus: jes"
};

Baltek.View.I18n.translations.en = {
    "Baltek_ButtonZone_About_button"      : "About" ,
    "Baltek_ButtonZone_About_file"        : "./lang/en/Baltek-about-en.html" ,

    "Baltek_ButtonZone_BlueKind_human"    : "Human" ,
    "Baltek_ButtonZone_BlueKind_ai1"      : "AI1" ,
    "Baltek_ButtonZone_BlueKind_ai2"      : "AI2" ,
    "Baltek_ButtonZone_BlueKind_ai3"      : "AI3" ,

    "Baltek_ButtonZone_Coordinates_no"    : "Coordinates: no",
    "Baltek_ButtonZone_Coordinates_yes"   : "Coordinates: yes",

    "Baltek_ButtonZone_EndTurn_button"    : "End my turn" ,

    "Baltek_ButtonZone_Help_button"       : "Help" ,
    "Baltek_ButtonZone_Help_file"         : "./lang/en/Baltek-help-en.html" ,

    "Baltek_ButtonZone_Kickoff_button"    : "Kickoff" ,

    "Baltek_ButtonZone_Language_name"     : "English" ,

    "Baltek_ButtonZone_NewGame_button"    : "New game" ,

    "Baltek_ButtonZone_QuitGame_button"   : "Quit game" ,

    "Baltek_ButtonZone_RedKind_human"     : "Human" ,
    "Baltek_ButtonZone_RedKind_ai1"       : "AI1" ,
    "Baltek_ButtonZone_RedKind_ai2"       : "AI2" ,
    "Baltek_ButtonZone_RedKind_ai3"       : "AI3" ,

    "Baltek_ButtonZone_ResumeGame_button" : "Resume game" ,

    "Baltek_ButtonZone_Rules_button"      : "Rules" ,
    "Baltek_ButtonZone_Rules_file"        : "./lang/en/Baltek-rules-en.html",

    "Baltek_ButtonZone_UseBonus_no"       : "Use my bonus: no",
    "Baltek_ButtonZone_UseBonus_yes"      : "Use my bonus: yes"
};

Baltek.View.I18n.translations.fr = {
    "Baltek_ButtonZone_About_button"      : "A propos" ,
    "Baltek_ButtonZone_About_file"        : "./lang/fr/Baltek-about-fr.html" ,

    "Baltek_ButtonZone_BlueKind_human"    : "Humain" ,
    "Baltek_ButtonZone_BlueKind_ai1"      : "IA1" ,
    "Baltek_ButtonZone_BlueKind_ai2"      : "IA2" ,
    "Baltek_ButtonZone_BlueKind_ai3"      : "IA3" ,

    "Baltek_ButtonZone_Coordinates_no"    : "Coordonnées : non",
    "Baltek_ButtonZone_Coordinates_yes"   : "Coordonnées : oui",

    "Baltek_ButtonZone_EndTurn_button"    : "Finir mon tour" ,

    "Baltek_ButtonZone_Help_button"       : "Aide" ,
    "Baltek_ButtonZone_Help_file"         : "./lang/fr/Baltek-help-fr.html" ,

    "Baltek_ButtonZone_Kickoff_button"    : "Engager" ,

    "Baltek_ButtonZone_Language_name"     : "Français" ,

    "Baltek_ButtonZone_NewGame_button"    : "Nouvelle partie" ,

    "Baltek_ButtonZone_QuitGame_button"   : "Quitter la partie" ,

    "Baltek_ButtonZone_RedKind_human"     : "Humain" ,
    "Baltek_ButtonZone_RedKind_ai1"       : "IA1" ,
    "Baltek_ButtonZone_RedKind_ai2"       : "IA2" ,
    "Baltek_ButtonZone_RedKind_ai3"       : "IA3" ,

    "Baltek_ButtonZone_ResumeGame_button" : "Continuer le jeu" ,

    "Baltek_ButtonZone_Rules_button"      : "Règles" ,
    "Baltek_ButtonZone_Rules_file"        : "./lang/fr/LucasBorboleta_Baltek--fr--Jeu-de-football-tactique_LB_2015-1129-1050.pdf" ,

    "Baltek_ButtonZone_UseBonus_no"       : "Utiliser mon bonus: non",
    "Baltek_ButtonZone_UseBonus_yes"      : "Utiliser mon bonus: oui"
};

Baltek.View.I18n.translations.pt = {
    "Baltek_ButtonZone_About_button"      : "Acerca" ,
    "Baltek_ButtonZone_About_file"        : "./lang/pt/Baltek-about-pt.html" ,

    "Baltek_ButtonZone_BlueKind_human"    : "*(pt)Human" ,
    "Baltek_ButtonZone_BlueKind_ai1"      : "*(pt)AI1" ,
    "Baltek_ButtonZone_BlueKind_ai2"      : "*(pt)AI2" ,
    "Baltek_ButtonZone_BlueKind_ai3"      : "*(pt)AI3" ,

    "Baltek_ButtonZone_Coordinates_no"    : "Coordenadas: não",
    "Baltek_ButtonZone_Coordinates_yes"   : "Coordenadas: sim",

    "Baltek_ButtonZone_EndTurn_button"    : "*(eo)End my turn" ,

    "Baltek_ButtonZone_Help_button"       : "Ajuda" ,
    "Baltek_ButtonZone_Help_file"         : "./lang/pt/Baltek-help-pt.html" ,

    "Baltek_ButtonZone_Kickoff_button"    : "*(pt)Kickoff" ,

    "Baltek_ButtonZone_Language_name"     : "Português" ,

    "Baltek_ButtonZone_NewGame_button"    : "*(pt)New game" ,

    "Baltek_ButtonZone_QuitGame_button"   : "*(pt)Quit game" ,

    "Baltek_ButtonZone_RedKind_human"     : "*(pt)Human" ,
    "Baltek_ButtonZone_RedKind_ai1"       : "*(pt)AI1" ,
    "Baltek_ButtonZone_RedKind_ai2"       : "*(pt)AI2" ,
    "Baltek_ButtonZone_RedKind_ai3"       : "*(pt)AI3" ,

    "Baltek_ButtonZone_ResumeGame_button" : "*(pt)Resume game" ,

    "Baltek_ButtonZone_Rules_button"      : "Regras" ,
    "Baltek_ButtonZone_Rules_file"        : "./lang/pt/Baltek-rules-pt.html" ,

    "Baltek_ButtonZone_UseBonus_no"       : "Use my bonus: no",
    "Baltek_ButtonZone_UseBonus_yes"      : "Use my bonus: yes"
};
///////////////////////////////////////////////////////////////////////////////
