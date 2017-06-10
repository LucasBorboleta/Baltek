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

    this.game = new baltek.widget.Button( "Baltek_ButtonZone_GoToGame" , this.i18nTranslator);
    this.game.registerObserver(this);

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

    var SCORE_MAX = 2;

    var BONUS_MAX = 1;
    var BONUS_ZERO_SYMBOL = "-";
    var BONUS_ONE_SYMBOL = "*";

    var CREDIT_MAX = 3;
    var CREDIT_ZERO_SYMBOL = "-";
    var CREDIT_ONE_SYMBOL = "$";

    this.blueBonus = new baltek.widget.CounterWithSymbols( "Baltek_ButtonZone_BlueBonus" , this.i18nTranslator,
                                                BONUS_MAX, BONUS_ZERO_SYMBOL, BONUS_ONE_SYMBOL);
    this.blueBonus.setColor(baltek.style.colors.WHITE);
    this.blueBonus.setBackgroundColor(baltek.style.colors.BLUE);
    this.blueBonus.setCount( 1 );

    this.blueScore = new baltek.widget.CounterWithDecimals( "Baltek_ButtonZone_BlueScore" , this.i18nTranslator, SCORE_MAX);
    this.blueScore.setColor(baltek.style.colors.WHITE);
    this.blueScore.setBackgroundColor(baltek.style.colors.BLUE);
    this.blueScore.setCount( 3 );

    this.redScore = new baltek.widget.CounterWithDecimals( "Baltek_ButtonZone_RedScore" , this.i18nTranslator, SCORE_MAX);
    this.redScore.setColor(baltek.style.colors.WHITE);
    this.redScore.setBackgroundColor(baltek.style.colors.RED);
    this.redScore.setCount( 0 );

    this.redBonus = new baltek.widget.CounterWithSymbols( "Baltek_ButtonZone_RedBonus" , this.i18nTranslator,
                                                BONUS_MAX, BONUS_ZERO_SYMBOL, BONUS_ONE_SYMBOL);
    this.redBonus.setColor(baltek.style.colors.WHITE);
    this.redBonus.setBackgroundColor(baltek.style.colors.RED);
    this.redBonus.setCount( 0 );

    this.sprint = new baltek.widget.Selector( "Baltek_ButtonZone_Sprint", this.i18nTranslator,
                                         [ "no", "yes" ] );
    this.sprint.registerObserver(this);

    this.confirm = new baltek.widget.Button( "Baltek_ButtonZone_Confirm" , this.i18nTranslator);
    this.confirm.registerObserver(this);

    this.cancel = new baltek.widget.Button( "Baltek_ButtonZone_Cancel" , this.i18nTranslator);
    this.cancel.registerObserver(this);

    this.credit = new baltek.widget.CounterWithSymbols( "Baltek_ButtonZone_Credit" , this.i18nTranslator,
                                                CREDIT_MAX, CREDIT_ZERO_SYMBOL, CREDIT_ONE_SYMBOL);
    this.credit.setColor(baltek.style.colors.WHITE);
    this.credit.setBackgroundColor(baltek.style.colors.BLUE);
    this.credit.setCount( 3 );

    this.language = new baltek.widget.Selector( "Baltek_ButtonZone_Language", this.i18nTranslator,
                                         this.i18nTranslator.getAvailableLanguages() );
    this.language.registerObserver(this);
    this.language.setSelection(this.i18nTranslator.getLanguage());

    this.coordinates = new baltek.widget.Selector( "Baltek_ButtonZone_Coordinates", this.i18nTranslator,
                                             [ "no", "yes" ] );
    this.coordinates.registerObserver(this);
    this.coordinates.setSelection("no");

    this.what = new baltek.widget.Button( "Baltek_ButtonZone_GoToHelp" , this.i18nTranslator);
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

    this.blueBonus.enable(false);
    this.blueKind.enable(false);
    this.redKind.enable(false);
    this.redBonus.enable(false);

    this.game.enable(false);

    this.sprint.enable(false);
    this.confirm.enable(false);
    this.cancel.enable(false);
    this.credit.enable(false);

    this.language.enable(false);
    this.coordinates.enable(false);

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

    this.blueBonus.show(false);
    this.blueScore.show(false);
    this.blueKind.show(false);
    this.redKind.show(false);
    this.redScore.show(false);
    this.redBonus.show(false);

    this.game.show(false);

    this.sprint.show(false);
    this.confirm.show(false);
    this.cancel.show(false);
    this.credit.show(false);

    this.language.show(false);
    this.coordinates.show(false);

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
    // newState and this must be sibbling states
    baltek.utils.assert( newState !== null );
    baltek.utils.assert( newState.superState !== null );
    baltek.utils.assert( newState.superState === this.superState );

    this.exit();
    newState.superState.substate = newState;
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

baltek.presenter.SuperState.prototype.atEnter = function(){
}

baltek.presenter.SuperState.prototype.atExit = function(){
}

baltek.presenter.SuperState.prototype.enableHistory = function(condition){
    this.enabledHistory = condition;
}

baltek.presenter.SuperState.prototype.enter = function(){
    this.atEnter();

    if ( this.substate === null ) {
        this.substate = this.getDefaultSubstate();
        baltek.utils.assert( this.substate !== null );
    }

    this.presenter.state = this.substate;
    this.presenter.state.enter();
}

baltek.presenter.SuperState.prototype.exit = function(){
    this.atExit();

    this.substate.exit();

    if ( ! this.enabledHistory ) {
        this.substate = null;
    }
}

baltek.presenter.SuperState.prototype.getDefaultSubstate = function(){
    baltek.utils.assert( false, "must be redefined" );
    return null;
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
    this.gameTopState = new baltek.presenter.GameTopState(this.presenter, this);
    this.whatTopState = new baltek.presenter.WhatTopState(this.presenter, this);
}

baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
    return this.gameTopState;
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
baltek.presenter.GameTopState = function(presenter, superState){
    this.$init(presenter, superState);
}

baltek.utils.inherit(baltek.presenter.GameTopState, baltek.presenter.SuperState);

baltek.presenter.GameTopState.prototype.$init = function(presenter, superState){
    baltek.presenter.GameTopState.super.$init.call(this, presenter, superState);
    this.enableHistory(true);
}

baltek.presenter.GameTopState.prototype.atEnter = function(){
    baltek.draw.canvas.style.display = "inherit";
}

baltek.presenter.GameTopState.prototype.atExit = function(){
    baltek.draw.canvas.style.display = "none";
}

baltek.presenter.GameTopState.prototype.initSubstates = function(){
    this.gameStateIsFinished = new baltek.presenter.GameStateIsFinished(this.presenter, this);
    this.gameStateIsReadyToStart = new baltek.presenter.GameStateIsReadyToStart(this.presenter, this);
    this.gameStateIsRunning = new baltek.presenter.GameStateIsRunning(this.presenter, this);
    this.gameStateIsReadyToQuit = new baltek.presenter.GameStateIsReadyToQuit(this.presenter, this);
}

baltek.presenter.GameTopState.prototype.getDefaultSubstate = function(){
    return this.gameStateIsReadyToStart;
}

baltek.presenter.GameTopState.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.coordinates ) {
        this.presenter.showXYLabels( this.presenter.coordinates.getSelection() === "yes" );

    } else if ( observable === this.presenter.what ) {
        this.setState(this.superState.whatTopState);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsFinished = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.GameStateIsFinished, baltek.presenter.State);

baltek.presenter.GameStateIsFinished.prototype.$init = function(presenter, superState){
    baltek.presenter.GameStateIsFinished.super.$init.call(this, presenter, superState);
}

baltek.presenter.GameStateIsFinished.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.restartGame.show(true);
    this.presenter.blueScore.show(true);
    this.presenter.redScore.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.restartGame.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.GameStateIsFinished.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.restartGame ) {
        this.setState(this.superState.gameStateIsReadyToStart);

    } else if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.gameStateIsFinished);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToStart = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.GameStateIsReadyToStart, baltek.presenter.State);

baltek.presenter.GameStateIsReadyToStart.prototype.$init = function(presenter, superState){
    baltek.presenter.GameStateIsReadyToStart.super.$init.call(this, presenter, superState);
}

baltek.presenter.GameStateIsReadyToStart.prototype.enter = function(){
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

baltek.presenter.GameStateIsReadyToStart.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.blueKind ) {
        this.presenter.blueAgent.kind = this.presenter.blueKind.getSelection();

    } else if ( observable === this.presenter.redKind ) {
        this.presenter.redAgent.kind = this.presenter.redKind.getSelection();

    } else if ( observable === this.presenter.startGame ) {
        this.presenter.blueAgent.kind = this.presenter.blueKind.getSelection();
        this.presenter.redAgent.kind = this.presenter.redKind.getSelection();
        this.setState(this.superState.gameStateIsRunning);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsRunning = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.GameStateIsRunning, baltek.presenter.State);

baltek.presenter.GameStateIsRunning.prototype.$init = function(presenter, superState){
    baltek.presenter.GameStateIsRunning.super.$init.call(this, presenter, superState);
}

baltek.presenter.GameStateIsRunning.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.quitGame.show(true);
    this.presenter.blueBonus.show(true);
    this.presenter.blueScore.show(true);
    this.presenter.redScore.show(true);
    this.presenter.redBonus.show(true);
    this.presenter.sprint.show(true);
    this.presenter.confirm.show(true);
    this.presenter.cancel.show(true);
    this.presenter.credit.show(true);
    this.presenter.coordinates.show(true);
    this.presenter.language.show(true);
    this.presenter.what.show(true);

    this.presenter.disableAllButtons();
    this.presenter.quitGame.enable(true);
    this.presenter.sprint.enable(true);
    this.presenter.confirm.enable(true);
    this.presenter.cancel.enable(true);
    this.presenter.coordinates.enable(true);
    this.presenter.language.enable(true);
    this.presenter.what.enable(true);
}

baltek.presenter.GameStateIsRunning.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.gameStateIsReadyToQuit);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToQuit = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.GameStateIsReadyToQuit, baltek.presenter.State);

baltek.presenter.GameStateIsReadyToQuit.prototype.$init = function(presenter, superState){
    baltek.presenter.GameStateIsReadyToQuit.super.$init.call(this, presenter, superState);
}

baltek.presenter.GameStateIsReadyToQuit.prototype.enter = function(){
    this.presenter.hideAllButtons();
    this.presenter.resumeGame.show(true);
    this.presenter.quitGame.show(true);
    this.presenter.blueBonus.show(true);
    this.presenter.blueScore.show(true);
    this.presenter.redScore.show(true);
    this.presenter.redBonus.show(true);
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

baltek.presenter.GameStateIsReadyToQuit.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.resumeGame ) {
        this.setState(this.superState.gameStateIsRunning);

    } else if ( observable === this.presenter.quitGame ) {
        this.setState(this.superState.gameStateIsFinished);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatTopState = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.WhatTopState, baltek.presenter.SuperState);

baltek.presenter.WhatTopState.prototype.$init = function(presenter, superState){
    baltek.presenter.WhatTopState.super.$init.call(this, presenter, superState);
    this.enableHistory(true);
}

baltek.presenter.WhatTopState.prototype.atEnter = function(){
    this.presenter.rulesIFrame.show(false);
    this.presenter.helpIFrame.show(false);
    this.presenter.aboutIFrame.show(false);

    this.presenter.hideAllButtons();
    this.presenter.language.show(true);
    this.presenter.game.show(true);
    this.presenter.rules.show(true);
    this.presenter.help.show(true);
    this.presenter.about.show(true);

    this.presenter.disableAllButtons();
    this.presenter.language.enable(true);
    this.presenter.game.enable(true);
}

baltek.presenter.WhatTopState.prototype.atExit = function(){
    this.presenter.rulesIFrame.show(false);
    this.presenter.helpIFrame.show(false);
    this.presenter.aboutIFrame.show(false);
}

baltek.presenter.WhatTopState.prototype.initSubstates = function(){
    this.whatStateShowRules = new baltek.presenter.WhatStateShowRules(this.presenter, this);
    this.whatStateShowHelp = new baltek.presenter.WhatStateShowHelp(this.presenter, this);
    this.whatStateShowAbout = new baltek.presenter.WhatStateShowAbout(this.presenter, this);
}

baltek.presenter.WhatTopState.prototype.getDefaultSubstate = function(){
    return this.whatStateShowAbout;
}

baltek.presenter.WhatTopState.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.game ) {
        this.setState(this.superState.gameTopState);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowRules = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.WhatStateShowRules, baltek.presenter.State);

baltek.presenter.WhatStateShowRules.prototype.$init = function(presenter, superState){
    baltek.presenter.WhatStateShowRules.super.$init.call(this, presenter, superState);
}

baltek.presenter.WhatStateShowRules.prototype.enter = function(){
    this.presenter.rulesIFrame.show(true);

    this.presenter.rules.enable(false);
    this.presenter.help.enable(true);
    this.presenter.about.enable(true);
}

baltek.presenter.WhatStateShowRules.prototype.exit = function(){
    this.presenter.rulesIFrame.show(false);

    this.presenter.rules.enable(false);
    this.presenter.help.enable(false);
    this.presenter.about.enable(false);
}

baltek.presenter.WhatStateShowRules.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.rules ) {
        this.setState(this.superState.whatStateShowRules);

    } else if ( observable === this.presenter.help ) {
        this.setState(this.superState.whatStateShowHelp);

    } else if ( observable === this.presenter.about ) {
        this.setState(this.superState.whatStateShowAbout);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowHelp = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.WhatStateShowHelp, baltek.presenter.State);

baltek.presenter.WhatStateShowHelp.prototype.$init = function(presenter, superState){
    baltek.presenter.WhatStateShowHelp.super.$init.call(this, presenter, superState);
}

baltek.presenter.WhatStateShowHelp.prototype.enter = function(){
    this.presenter.helpIFrame.show(true);

    this.presenter.rules.enable(true);
    this.presenter.help.enable(false);
    this.presenter.about.enable(true);
}

baltek.presenter.WhatStateShowHelp.prototype.exit = function(){
    this.presenter.helpIFrame.show(false);

    this.presenter.rules.enable(false);
    this.presenter.help.enable(false);
    this.presenter.about.enable(false);
}

baltek.presenter.WhatStateShowHelp.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.rules ) {
        this.setState(this.superState.whatStateShowRules);

    } else if ( observable === this.presenter.help ) {
        this.setState(this.superState.whatStateShowHelp);

    } else if ( observable === this.presenter.about ) {
        this.setState(this.superState.whatStateShowAbout);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowAbout = function(presenter, superState){
    this.$init(presenter, superState);
};

baltek.utils.inherit(baltek.presenter.WhatStateShowAbout, baltek.presenter.State);

baltek.presenter.WhatStateShowAbout.prototype.$init = function(presenter, superState){
    baltek.presenter.WhatStateShowAbout.super.$init.call(this, presenter, superState);
}

baltek.presenter.WhatStateShowAbout.prototype.enter = function(){
    this.presenter.aboutIFrame.show(true);

    this.presenter.rules.enable(true);
    this.presenter.help.enable(true);
    this.presenter.about.enable(false);
}

baltek.presenter.WhatStateShowAbout.prototype.exit = function(){
    this.presenter.aboutIFrame.show(false);

    this.presenter.rules.enable(false);
    this.presenter.help.enable(false);
    this.presenter.about.enable(false);
}

baltek.presenter.WhatStateShowAbout.prototype.updateFromObservable = function(observable){

    if ( observable === this.presenter.rules ) {
        this.setState(this.superState.whatStateShowRules);

    } else if ( observable === this.presenter.help ) {
        this.setState(this.superState.whatStateShowHelp);

    } else if ( observable === this.presenter.about ) {
        this.setState(this.superState.whatStateShowAbout);

    } else {

        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
