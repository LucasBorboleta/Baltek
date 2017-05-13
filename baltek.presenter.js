"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter = { $initCalled: false };

baltek.presenter.$init = function(){
    if ( ! baltek.presenter.$initCalled ) {
        baltek.presenter.$initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
        baltek.draw.$init();
        baltek.rules.$init();
        baltek.utils.$init();
        baltek.widget.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.Presenter = function(){
    this.$init();
};

baltek.utils.inherit(baltek.presenter.Presenter, Object);

baltek.presenter.Presenter.prototype.$init = function(){

    this.blueAgent = { kind: "" };
    this.redAgent = { kind: "" };

    this.i18nTranslator = new baltek.i18n.Translator(baltek.i18n.translations, "fr" );

    this.startGame = new baltek.widget.Button( "Baltek_ButtonZone_StartGame" , this.i18nTranslator);
    this.startGame.registerObserver(this);

    this.restartGame = new baltek.widget.Button( "Baltek_ButtonZone_RestartGame" , this.i18nTranslator);
    this.restartGame.registerObserver(this);

    this.resumeGame = new baltek.widget.Button( "Baltek_ButtonZone_ResumeGame" , this.i18nTranslator );
    this.resumeGame.registerObserver(this);

    this.quitGame = new baltek.widget.Button( "Baltek_ButtonZone_QuitGame" , this.i18nTranslator);
    this.quitGame.registerObserver(this);

    this.blueKind = new baltek.widget.Selector( "Baltek_ButtonZone_BlueKind", this.i18nTranslator,
                                         [ "human", "ai1", "ai2", "ai3" ] );
    this.blueKind.registerObserver(this);
    this.blueKind.setColor(baltek.style.colors.WHITE);
    this.blueKind.setBackgroundColor(baltek.style.colors.BLUE);

    this.redKind = new baltek.widget.Selector( "Baltek_ButtonZone_RedKind", this.i18nTranslator,
                                        [ "human", "ai1", "ai2", "ai3" ] );
    this.redKind.registerObserver(this);
    this.redKind.setColor(baltek.style.colors.WHITE);
    this.redKind.setBackgroundColor(baltek.style.colors.RED);

    this.kickoff = new baltek.widget.Button( "Baltek_ButtonZone_Kickoff" , this.i18nTranslator);
    this.kickoff.registerObserver(this);

    this.useBonus = new baltek.widget.Selector( "Baltek_ButtonZone_UseBonus", this.i18nTranslator,
                                         [ "no", "yes" ] );
    this.useBonus.registerObserver(this);

    this.endTurn = new baltek.widget.Button( "Baltek_ButtonZone_EndTurn" , this.i18nTranslator);
    this.endTurn.registerObserver(this);

    this.language = new baltek.widget.Selector( "Baltek_ButtonZone_Language", this.i18nTranslator,
                                         this.i18nTranslator.getAvailableLanguages() );
    this.language.registerObserver(this);
    this.language.setSelection(this.i18nTranslator.getLanguage());

    this.coordinates = new baltek.widget.Selector( "Baltek_ButtonZone_Coordinates", this.i18nTranslator,
                                             [ "no", "yes" ] );
    this.coordinates.registerObserver(this);
    this.coordinates.setSelection("no");

    this.game = new baltek.widget.Button( "Baltek_ButtonZone_Game" , this.i18nTranslator);
    this.game.registerObserver(this);

    this.what = new baltek.widget.Button( "Baltek_ButtonZone_What" , this.i18nTranslator);
    this.what.registerObserver(this);

    this.rulesIFrame = new baltek.widget.IFrame( "Baltek_DrawZone_Rules" , this.i18nTranslator);
    this.rules = new baltek.widget.Button( "Baltek_ButtonZone_Rules" , this.i18nTranslator);
    this.rules.registerObserver(this);

    this.helpIFrame = new baltek.widget.IFrame( "Baltek_DrawZone_Help" , this.i18nTranslator);
    this.help = new baltek.widget.Button( "Baltek_ButtonZone_Help" , this.i18nTranslator);
    this.help.registerObserver(this);

    this.aboutIFrame = new baltek.widget.IFrame( "Baltek_DrawZone_About" , this.i18nTranslator);
    this.about = new baltek.widget.Button( "Baltek_ButtonZone_About" , this.i18nTranslator);
    this.about.registerObserver(this);

    this.rulesEngine = new baltek.rules.Engine();
    this.initField();
    this.drawField();
    this.initBall();
    this.drawBall();
    this.initFootballers();
    this.drawFootballers();

    this.state = new baltek.presenter.TopState(this, null);
    this.state.enter();
}

baltek.presenter.Presenter.prototype.disableAllButtons = function(){
    this.startGame.enable(false);
    this.restartGame.enable(false);
    this.resumeGame.enable(false);
    this.quitGame.enable(false);
    this.blueKind.enable(false);
    this.redKind.enable(false);
    this.kickoff.enable(false);
    this.useBonus.enable(false);
    this.endTurn.enable(false);
    this.language.enable(false);
    this.coordinates.enable(false);
    this.game.enable(false);
    this.what.enable(false);
    this.rules.enable(false);
    this.help.enable(false);
    this.about.enable(false);
}

baltek.presenter.Presenter.prototype.drawBall = function(){
    var ballIndices = this.rulesEngine.getBallBoxIndices();
    var ballBox = this.draw.boxesByIndices[ballIndices.ix][ballIndices.iy];
    ballBox.setBall(this.draw.ball);
    this.draw.ball.enableSelection();
}

baltek.presenter.Presenter.prototype.drawField = function(){
    var ix = 0;
    var iy = 0;
    var box = null;
    for (ix=0; ix < this.draw.fieldNx; ix++) {
        for (iy=0; iy < this.draw.fieldNy; iy++) {
            box = this.draw.boxesByIndices[ix][iy];
            if ( box !== null ) {
                box.draw();
                box.disableSelection();
            }
        }
    }
}

baltek.presenter.Presenter.prototype.drawFootballers = function(){
    var teamIndex = 0;
    var teamCount = 2;

    var footballerCount = 0;
    var footballerIndex = 0;
    var footballerIndices = null;
    var footballerBox = null;

    for (teamIndex=0; teamIndex<teamCount; teamIndex++) {
        footballerCount = this.draw.teams[teamIndex].length;

        for (footballerIndex=0; footballerIndex<footballerCount; footballerIndex++) {
            footballerIndices = this.rulesEngine.getFooballerBoxIndices(teamIndex, footballerIndex);
            footballerBox = this.draw.boxesByIndices[footballerIndices.ix][footballerIndices.iy];
            footballerBox.setFootballer(this.draw.teams[teamIndex][footballerIndex]);
            this.draw.teams[teamIndex][footballerIndex].enableSelection();
        }
    }
}

baltek.presenter.Presenter.prototype.hideAllButtons = function(){
    this.startGame.show(false);
    this.restartGame.show(false);
    this.resumeGame.show(false);
    this.quitGame.show(false);
    this.blueKind.show(false);
    this.redKind.show(false);
    this.kickoff.show(false);
    this.useBonus.show(false);
    this.endTurn.show(false);
    this.language.show(false);
    this.coordinates.show(false);
    this.game.show(false);
    this.what.show(false);
    this.rules.show(false);
    this.help.show(false);
    this.about.show(false);
}

baltek.presenter.Presenter.prototype.initBall = function(){
    this.draw.ball = new baltek.draw.Ball();
}

baltek.presenter.Presenter.prototype.initField = function(){
    this.draw = {};
    this.draw.fieldNx = this.rulesEngine.getFieldNx();
    this.draw.fieldNy = this.rulesEngine.getFieldNy();
    baltek.draw.setBoxLatticeDimensions(this.draw.fieldNx, this.draw.fieldNy);

    this.draw.xLabels = [];
    var letters = "abcdefghijklmnopqrstuvwxyz".split("");
    baltek.utils.assert( this.draw.fieldNx <= letters.length);
    for (ix=0; ix < this.draw.fieldNx; ix++) {
        this.draw.xLabels[ix] = letters[ix];
    }

    this.draw.yLabels = [];
    var digits = "123456789".split("");
    baltek.utils.assert( this.draw.fieldNy <= digits.length);
    for (iy=0; iy < this.draw.fieldNy; iy++) {
        this.draw.yLabels[iy] = digits[this.draw.fieldNy - iy - 1];
    }

    this.draw.boxesByIndices = [] ;

    var ix = 0;
    var iy = 0;
    var box = null;
    var xyLabel = "";
    for (ix=0; ix < this.draw.fieldNx; ix++) {
        this.draw.boxesByIndices.push([]);

        for (iy=0; iy < this.draw.fieldNy; iy++) {
            this.draw.boxesByIndices[ix].push(null);
            if ( this.rulesEngine.hasFieldBox(ix, iy) ) {
                xyLabel = this.draw.xLabels[ix] + this.draw.yLabels[iy];
                box = new baltek.draw.Box(ix, iy, xyLabel);
                this.draw.boxesByIndices[ix][iy] = box;
            }
        }
    }
}

baltek.presenter.Presenter.prototype.initFootballers = function(){
    this.draw.teams = [];
    this.draw.teams.push([]);
    this.draw.teams.push([]);

    var teamIndex = 0;
    var teamCount = 2;

    var footballerCount = 0;
    var footballerIndex = 0;
    var footballerForce = 0;

    for (teamIndex=0; teamIndex<teamCount; teamIndex++) {
        footballerCount = this.rulesEngine.getFooballerCount(teamIndex);

        for (footballerIndex=0; footballerIndex<footballerCount; footballerIndex++) {
            footballerForce = this.rulesEngine.getFooballerForce(teamIndex, footballerIndex);
            this.draw.teams[teamIndex].push(new baltek.draw.Footballer(teamIndex, footballerForce));
        }
    }
}

baltek.presenter.Presenter.prototype.showXYLabels = function(condition){
    var ix = 0;
    var iy = 0;
    var box = null;
    for (ix=0; ix < this.draw.fieldNx; ix++) {
        for (iy=0; iy < this.draw.fieldNy; iy++) {
            box = this.draw.boxesByIndices[ix][iy]
            if ( box !== null ) {
                box.showXYLabel(condition);
            }
        }
    }
}

baltek.presenter.Presenter.prototype.updateFromObservable = function(observable){
    this.state.updateFromObservable(observable);
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.State = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.State, Object);

baltek.presenter.State.prototype.$init = function(presenter, superState){
    this.presenter = presenter;

    if ( superState !== undefined ) {
        this.superState = superState;
    } else {
        this.superState = null;
    }
}

baltek.presenter.State.prototype.setState = function(newState){
    baltek.utils.assert( newState !== null );

    if ( this.presenter.state !== null ) {
        this.presenter.state.exit();

        if ( this.presenter.state.superState !== null ) {
            if ( this.presenter.state.superState !== newState.superState ) {
                this.presenter.state.superState.exit();
            }
        }
    }

    if ( this.superState !== null ) {
        baltek.utils.assert( this.superState.hasSubstate(newState) );
    }
    this.presenter.state = newState;
    this.presenter.state.enter();
}

baltek.presenter.State.prototype.enter = function(){
}

baltek.presenter.State.prototype.exit = function(){
}

baltek.presenter.State.prototype.updateFromObservable = function(observable){
    if ( this.superState !== null ) {
        this.superState.updateFromObservable(observable);
    } else {
        baltek.utils.assert( false, "observable not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.SuperState = function(presenter, superState){
    this.$init(presenter, superState);
}

baltek.utils.inherit(baltek.presenter.SuperState, baltek.presenter.State);

baltek.presenter.SuperState.prototype.$init = function(presenter, superState){
    baltek.presenter.SuperState.super.$init.call(this, presenter, superState);
    this.substate = null;
    this.enabledHistory = false;
    this.initSubstates();
}

baltek.presenter.SuperState.prototype.enableHistory = function(condition){
    this.enabledHistory = condition;
}

baltek.presenter.SuperState.prototype.setSubstate = function(newSubstate){

    baltek.utils.assert( newSubstate !== null );
    baltek.utils.assert( newSubstate.superState === this );
    baltek.utils.assert( this.hasSubstate(newSubstate) );
    baltek.utils.assert( this.presenter.state === this );

    this.presenter.state = newSubstate;
    this.presenter.state.enter();
}

baltek.presenter.SuperState.prototype.enter = function(){
    if ( this.substate === null ) {
        this.substate = this.getDefaultSubstate();
        baltek.utils.assert( this.substate !== null );
    }

    this.setSubstate(this.substate);
}

baltek.presenter.SuperState.prototype.exit = function(){
    this.substate.exit();

    if ( ! this.enabledHistory ) {
        this.substate = null;
    }
}

baltek.presenter.SuperState.prototype.getDefaultSubstate = function(){
    baltek.utils.assert( false, "must be redefined" );
    return null;
}

baltek.presenter.SuperState.prototype.hasSubstate = function(substate){
    baltek.utils.assert( false, "must be redefined" );
    return false;
}

baltek.presenter.SuperState.prototype.initSubstates = function(){
    baltek.utils.assert( false, "must be redefined" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopState = function(presenter, superState){
    this.$init(presenter, superState);
}

baltek.utils.inherit(baltek.presenter.TopState, baltek.presenter.SuperState);

baltek.presenter.TopState.prototype.$init = function(presenter, superState){
    baltek.presenter.TopState.super.$init.call(this, presenter, superState);
    this.enableHistory(true);
}

baltek.presenter.TopState.prototype.initSubstates = function(){
    this.topGameState = new baltek.presenter.TopGameState(this.presenter, this);
    this.topWhatState = new baltek.presenter.TopWhatState(this.presenter, this);
}

baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
    return this.topGameState;
}

baltek.presenter.TopState.prototype.hasSubstate = function(substate){
    return ( substate === this.topGameState ||
             substate === this.topWhatState );
}

baltek.presenter.TopState.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.language ) {
        this.presenter.i18nTranslator.setLanguage(this.presenter.language.getSelection());

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopGameState = function(presenter, superState){
    this.$init(presenter, superState);
}

baltek.utils.inherit(baltek.presenter.TopGameState, baltek.presenter.SuperState);

baltek.presenter.TopGameState.prototype.$init = function(presenter, superState){
    baltek.presenter.TopGameState.super.$init.call(this, presenter, superState);
    this.enableHistory(true);
}

baltek.presenter.TopGameState.prototype.enter = function(){
    baltek.draw.canvas.style.display = "inherit";
    baltek.debug.writeMessage("TopGameState: enter");
    baltek.presenter.TopGameState.super.enter.call(this);
}

baltek.presenter.TopGameState.prototype.exit = function(){
    baltek.draw.canvas.style.display = "none";
    baltek.debug.writeMessage("TopGameState: exit");
    baltek.presenter.TopGameState.super.exit.call(this);
}

baltek.presenter.TopGameState.prototype.initSubstates = function(){
    this.stateIsFinished = new baltek.presenter.StateIsFinished(this.presenter, this);
    this.stateIsReadyToStart = new baltek.presenter.StateIsReadyToStart(this.presenter, this);
    this.stateIsRunning = new baltek.presenter.StateIsRunning(this.presenter, this);
    this.stateIsReadyToQuit = new baltek.presenter.StateIsReadyToQuit(this.presenter, this);
}

baltek.presenter.TopGameState.prototype.getDefaultSubstate = function(){
    return this.stateIsReadyToStart;
}

baltek.presenter.TopGameState.prototype.hasSubstate = function(substate){
    return ( substate === this.stateIsFinished ||
             substate === this.stateIsReadyToStart ||
             substate === this.stateIsRunning ||
             substate === this.stateIsReadyToQuit );
}

baltek.presenter.TopGameState.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.coordinates ) {
        this.presenter.showXYLabels( this.presenter.coordinates.getSelection() === "yes" );

    } else if ( observable === this.presenter.what ) {
        this.setState(this.superState.topWhatState);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsFinished = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.StateIsFinished, baltek.presenter.State);

baltek.presenter.StateIsFinished.prototype.$init = function(presenter, superState){
    baltek.presenter.StateIsFinished.super.$init.call(this, presenter, superState);
}

baltek.presenter.StateIsFinished.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.restartGame.show(true);
    this.presenter.blueKind.show(true);
    this.presenter.redKind.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.restartGame.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.StateIsFinished.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.restartGame ) {
        this.setState(this.superState.stateIsReadyToStart);

    } else if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.stateIsFinished);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsReadyToStart = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.StateIsReadyToStart, baltek.presenter.State);

baltek.presenter.StateIsReadyToStart.prototype.$init = function(presenter, superState){
    baltek.presenter.StateIsReadyToStart.super.$init.call(this, presenter, superState);
}

baltek.presenter.StateIsReadyToStart.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.startGame.show(true);
    this.presenter.blueKind.show(true);
    this.presenter.redKind.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.startGame.enable(true);
    this.presenter.blueKind.enable(true);
    this.presenter.redKind.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.StateIsReadyToStart.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.blueKind ) {
        this.presenter.blueAgent.kind = this.presenter.blueKind.getSelection();

    } else if ( observable === this.presenter.redKind ) {
        this.presenter.redAgent.kind = this.presenter.redKind.getSelection();

    } else if ( observable === this.presenter.startGame ) {
        this.presenter.blueAgent.kind = this.presenter.blueKind.getSelection();
        this.presenter.redAgent.kind = this.presenter.redKind.getSelection();
        this.setState(this.superState.stateIsRunning);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsRunning = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.StateIsRunning, baltek.presenter.State);

baltek.presenter.StateIsRunning.prototype.$init = function(presenter, superState){
    baltek.presenter.StateIsRunning.super.$init.call(this, presenter, superState);
}

baltek.presenter.StateIsRunning.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.quitGame.show(true);
    this.presenter.blueKind.show(true);
    this.presenter.redKind.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.quitGame.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.StateIsRunning.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.stateIsReadyToQuit);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsReadyToQuit = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.StateIsReadyToQuit, baltek.presenter.State);

baltek.presenter.StateIsReadyToQuit.prototype.$init = function(presenter, superState){
    baltek.presenter.StateIsReadyToQuit.super.$init.call(this, presenter, superState);
}

baltek.presenter.StateIsReadyToQuit.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.resumeGame.show(true);
    this.presenter.quitGame.show(true);
    this.presenter.blueKind.show(true);
    this.presenter.redKind.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.resumeGame.enable(true);
    this.presenter.quitGame.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.StateIsReadyToQuit.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.resumeGame ) {
        this.setState(this.superState.stateIsRunning);

    } else if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.stateIsFinished);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopWhatState = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.TopWhatState, baltek.presenter.State);

baltek.presenter.TopWhatState.prototype.$init = function(presenter, superState){
    baltek.presenter.TopWhatState.super.$init.call(this, presenter, superState);
}

baltek.presenter.TopWhatState.prototype.enter = function(){
    baltek.debug.writeMessage("TopWhatState: enter");
    this.presenter.hideAllButtons();
    this.presenter.rulesIFrame.show(false);
    this.presenter.helpIFrame.show(false);
    this.presenter.aboutIFrame.show(true);

    this.presenter.language.show(true);
    this.presenter.game.show(true);
    this.presenter.rules.show(true);
    this.presenter.help.show(true);
    this.presenter.about.show(true);

    this.presenter.disableAllButtons();
    this.presenter.language.enable(true);
    this.presenter.game.enable(true);
    this.presenter.rules.enable(true);
    this.presenter.help.enable(true);
    this.presenter.about.enable(true);
}

baltek.presenter.TopWhatState.prototype.exit = function(){
    baltek.debug.writeMessage("TopWhatState: exit");
    this.presenter.rulesIFrame.show(false);
    this.presenter.helpIFrame.show(false);
    this.presenter.aboutIFrame.show(false);
}

baltek.presenter.TopWhatState.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.game ) {
        this.setState(this.superState.topGameState);

    } else if ( observable === this.presenter.rules ) {
        this.presenter.rulesIFrame.show(true);
        this.presenter.helpIFrame.show(false);
        this.presenter.aboutIFrame.show(false);

    } else if ( observable === this.presenter.help ) {
        this.presenter.rulesIFrame.show(false);
        this.presenter.helpIFrame.show(true);
        this.presenter.aboutIFrame.show(false);

    } else if ( observable === this.presenter.about ) {
        this.presenter.rulesIFrame.show(false);
        this.presenter.helpIFrame.show(false);
        this.presenter.aboutIFrame.show(true);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
