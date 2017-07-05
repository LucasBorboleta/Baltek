"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter = { };
baltek.presenter.$initPackageCalled = false;

baltek.presenter.$initPackage = function(){

    if ( baltek.presenter.$initPackageCalled ) return;
    baltek.presenter.$initPackageCalled = true;

    // Init required packages
    baltek.debug.$initPackage();
    baltek.draw.$initPackage();
    baltek.i18n.$initPackage();
    baltek.rules.$initPackage();
    baltek.utils.$initPackage();
    baltek.widget.$initPackage();

    // Init inner classes
    baltek.presenter.GameStateIsFinished.$initClass();
    baltek.presenter.GameStateIsReadyToStart.$initClass();
    baltek.presenter.GameStateIsReadyToQuit.$initClass();
    baltek.presenter.GameStateIsRunning.$initClass();
    baltek.presenter.GameTopState.$initClass();
    baltek.presenter.Presenter.$initClass();
    baltek.presenter.State.$initClass();
    baltek.presenter.SuperState.$initClass();
    baltek.presenter.TopState.$initClass();
    baltek.presenter.WhatStateShowAbout.$initClass();
    baltek.presenter.WhatStateShowHelp.$initClass();
    baltek.presenter.WhatStateShowRules.$initClass();
    baltek.presenter.WhatTopState.$initClass();
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsFinished = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.GameStateIsFinished.$initClassCalled = false;

baltek.presenter.GameStateIsFinished.$initClass = function(){

    if ( baltek.presenter.GameStateIsFinished.$initClassCalled ) return;
    baltek.presenter.GameStateIsFinished.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsFinished, baltek.presenter.State);

    baltek.presenter.GameStateIsFinished.prototype.$initObject = function(presenter, superState){
        baltek.presenter.GameStateIsFinished.super.$initObject.call(this, presenter, superState);
    }

    baltek.presenter.GameStateIsFinished.prototype.enter = function(){
        this.presenter.hideAllButtons();
        this.presenter.restartGame.show(true);
        this.presenter.team0Score.show(true);
        this.presenter.team1Score.show(true);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToQuit = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.GameStateIsReadyToQuit.$initClassCalled = false;

baltek.presenter.GameStateIsReadyToQuit.$initClass = function(){

    if ( baltek.presenter.GameStateIsReadyToQuit.$initClassCalled ) return;
    baltek.presenter.GameStateIsReadyToQuit.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsReadyToQuit, baltek.presenter.State);

    baltek.presenter.GameStateIsReadyToQuit.prototype.$initObject = function(presenter, superState){
        baltek.presenter.GameStateIsReadyToQuit.super.$initObject.call(this, presenter, superState);
    }

    baltek.presenter.GameStateIsReadyToQuit.prototype.enter = function(){
        this.presenter.hideAllButtons();
        this.presenter.resumeGame.show(true);
        this.presenter.quitGame.show(true);
        this.presenter.team0Bonus.show(true);
        this.presenter.team0Score.show(true);
        this.presenter.team1Score.show(true);
        this.presenter.team1Bonus.show(true);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToStart = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.GameStateIsReadyToStart.$initClassCalled = false;

baltek.presenter.GameStateIsReadyToStart.$initClass = function(){

    if ( baltek.presenter.GameStateIsReadyToStart.$initClassCalled ) return;
    baltek.presenter.GameStateIsReadyToStart.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsReadyToStart, baltek.presenter.State);

    baltek.presenter.GameStateIsReadyToStart.prototype.$initObject = function(presenter, superState){
        baltek.presenter.GameStateIsReadyToStart.super.$initObject.call(this, presenter, superState);
    }

    baltek.presenter.GameStateIsReadyToStart.prototype.enter = function(){
        this.presenter.hideAllButtons();
        this.presenter.startGame.show(true);
        this.presenter.team0Kind.show(true);
        this.presenter.team1Kind.show(true);
        this.presenter.coordinates.show(true);
        this.presenter.language.show(true);
        this.presenter.what.show(true);

        this.presenter.disableAllButtons();
        this.presenter.startGame.enable(true);
        this.presenter.team0Kind.enable(true);
        this.presenter.team1Kind.enable(true);
        this.presenter.coordinates.enable(true);
        this.presenter.language.enable(true);
        this.presenter.what.enable(true);
    }

    baltek.presenter.GameStateIsReadyToStart.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.team0Kind ) {
            this.presenter.team0Agent.kind = this.presenter.team0Kind.getSelection();

        } else if ( observable === this.presenter.team1Kind ) {
            this.presenter.team1Agent.kind = this.presenter.team1Kind.getSelection();

        } else if ( observable === this.presenter.startGame ) {
            this.presenter.team0Agent.kind = this.presenter.team0Kind.getSelection();
            this.presenter.team1Agent.kind = this.presenter.team1Kind.getSelection();
            this.setState(this.superState.gameStateIsRunning);

        } else {

            if ( this.superState !== null ) {
                this.superState.updateFromObservable(observable);
            } else {
                baltek.utils.assert( false, "observable not managed" );
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsRunning = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.GameStateIsRunning.$initClassCalled = false;

baltek.presenter.GameStateIsRunning.$initClass = function(){

    if ( baltek.presenter.GameStateIsRunning.$initClassCalled ) return;
    baltek.presenter.GameStateIsRunning.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsRunning, baltek.presenter.State);

    baltek.presenter.GameStateIsRunning.prototype.$initObject = function(presenter, superState){
        baltek.presenter.GameStateIsRunning.super.$initObject.call(this, presenter, superState);
    }

    baltek.presenter.GameStateIsRunning.prototype.enter = function(){
        this.presenter.hideAllButtons();
        this.presenter.quitGame.show(true);
        this.presenter.team0Bonus.show(true);
        this.presenter.team0Score.show(true);
        this.presenter.team1Score.show(true);
        this.presenter.team1Bonus.show(true);
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

        this.presenter.rulesEngine.matchInit();
        this.presenter.team0Score.setCount( this.presenter.rulesEngine.getScore(0) );
        this.presenter.team1Score.setCount( this.presenter.rulesEngine.getScore(1) );
        var activeTeamIndex = this.presenter.rulesEngine.getActiveTeamIndex();
        this.presenter.credit.setCount( this.presenter.rulesEngine.getCredit(activeTeamIndex) );
        this.presenter.credit.setBackgroundColor( baltek.style.colors.TEAM_COLORS[activeTeamIndex] );
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameTopState = function(presenter, superState){
    this.$initObject(presenter, superState);
}

baltek.presenter.GameTopState.$initClassCalled = false;

baltek.presenter.GameTopState.$initClass = function(){

    if ( baltek.presenter.GameTopState.$initClassCalled ) return;
    baltek.presenter.GameTopState.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameTopState, baltek.presenter.SuperState);

    baltek.presenter.GameTopState.prototype.$initObject = function(presenter, superState){
        baltek.presenter.GameTopState.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.Presenter = function(){
    this.$initObject();
};

baltek.presenter.Presenter.$initClassCalled = false;

baltek.presenter.Presenter.$initClass = function(){

    if ( baltek.presenter.Presenter.$initClassCalled ) return;
    baltek.presenter.Presenter.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.Presenter, Object);

    baltek.presenter.Presenter.prototype.$initObject = function(){
        this.rulesEngine = new baltek.rules.Engine();

        var SCORE_MAX = this.rulesEngine.getScoreMax();

        var BONUS_MAX = 1;
        var BONUS_ZERO_SYMBOL = "-";
        var BONUS_ONE_SYMBOL = "*";

        var CREDIT_MAX = this.rulesEngine.getCreditMax();
        var CREDIT_ZERO_SYMBOL = "-";
        var CREDIT_ONE_SYMBOL = "$";

        this.team0Agent = { kind: "" };
        this.team1Agent = { kind: "" };

        this.i18nTranslator = new baltek.i18n.Translator(baltek.i18n.translations, "fr" );

        this.startGame = new baltek.widget.Button( "baltek-button-startGame" , this.i18nTranslator);
        this.startGame.registerObserver(this);

        this.restartGame = new baltek.widget.Button( "baltek-button-restartGame" , this.i18nTranslator);
        this.restartGame.registerObserver(this);

        this.resumeGame = new baltek.widget.Button( "baltek-button-resumeGame" , this.i18nTranslator );
        this.resumeGame.registerObserver(this);

        this.quitGame = new baltek.widget.Button( "baltek-button-quitGame" , this.i18nTranslator);
        this.quitGame.registerObserver(this);

        this.game = new baltek.widget.Button( "baltek-button-goToGame" , this.i18nTranslator);
        this.game.registerObserver(this);

        this.team0Kind = new baltek.widget.Selector( "baltek-select-team0Kind", this.i18nTranslator,
                                             [ "human", "ai1", "ai2", "ai3" ] );
        this.team0Kind.registerObserver(this);
        this.team0Kind.setBackgroundColor(baltek.style.colors.TEAM_COLORS[0]);

        this.team1Kind = new baltek.widget.Selector( "baltek-select-team1Kind", this.i18nTranslator,
                                            [ "human", "ai1", "ai2", "ai3" ] );
        this.team1Kind.registerObserver(this);
        this.team1Kind.setBackgroundColor(baltek.style.colors.TEAM_COLORS[1]);

        this.team0Bonus = new baltek.widget.CounterWithSymbols( "baltek-counter-team0Bonus" , this.i18nTranslator,
                                                    BONUS_MAX, BONUS_ZERO_SYMBOL, BONUS_ONE_SYMBOL);
        this.team0Bonus.setBackgroundColor(baltek.style.colors.TEAM_COLORS[0]);

        this.team0Score = new baltek.widget.CounterWithDecimals( "baltek-counter-team0Score" , this.i18nTranslator, SCORE_MAX);
        this.team0Score.setBackgroundColor(baltek.style.colors.TEAM_COLORS[0]);

        this.team1Score = new baltek.widget.CounterWithDecimals( "baltek-counter-team1Score" , this.i18nTranslator, SCORE_MAX);
        this.team1Score.setBackgroundColor(baltek.style.colors.TEAM_COLORS[1]);

        this.team1Bonus = new baltek.widget.CounterWithSymbols( "baltek-counter-team1Bonus" , this.i18nTranslator,
                                                    BONUS_MAX, BONUS_ZERO_SYMBOL, BONUS_ONE_SYMBOL);
        this.team1Bonus.setBackgroundColor(baltek.style.colors.TEAM_COLORS[1]);

        this.sprint = new baltek.widget.Selector( "baltek-select-sprint", this.i18nTranslator,
                                             [ "no", "yes" ] );
        this.sprint.registerObserver(this);

        this.confirm = new baltek.widget.Button( "baltek-button-confirm" , this.i18nTranslator);
        this.confirm.registerObserver(this);

        this.cancel = new baltek.widget.Button( "baltek-button-cancel" , this.i18nTranslator);
        this.cancel.registerObserver(this);

        this.credit = new baltek.widget.CounterWithSymbols( "baltek-counter-credit" , this.i18nTranslator,
                                                    CREDIT_MAX, CREDIT_ZERO_SYMBOL, CREDIT_ONE_SYMBOL);

        this.language = new baltek.widget.Selector( "baltek-select-language", this.i18nTranslator,
                                             this.i18nTranslator.getAvailableLanguages() );
        this.language.registerObserver(this);
        this.language.setSelection(this.i18nTranslator.getLanguage());

        this.coordinates = new baltek.widget.Selector( "baltek-select-coordinates", this.i18nTranslator,
                                                 [ "no", "yes" ] );
        this.coordinates.registerObserver(this);
        this.coordinates.setSelection("no");

        this.what = new baltek.widget.Button( "baltek-button-goToHelp" , this.i18nTranslator);
        this.what.registerObserver(this);

        this.rulesIFrame = new baltek.widget.IFrame( "baltek-iframe-rules" , this.i18nTranslator);
        this.rules = new baltek.widget.Button( "baltek-button-rules" , this.i18nTranslator);
        this.rules.registerObserver(this);

        this.helpIFrame = new baltek.widget.IFrame( "baltek-iframe-help" , this.i18nTranslator);
        this.help = new baltek.widget.Button( "baltek-button-help" , this.i18nTranslator);
        this.help.registerObserver(this);

        this.aboutIFrame = new baltek.widget.IFrame( "baltek-iframe-about" , this.i18nTranslator);
        this.about = new baltek.widget.Button( "baltek-button-about" , this.i18nTranslator);
        this.about.registerObserver(this);

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

        this.team0Bonus.enable(false);
        this.team0Kind.enable(false);
        this.team1Kind.enable(false);
        this.team1Bonus.enable(false);

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

        this.team0Bonus.show(false);
        this.team0Score.show(false);
        this.team0Kind.show(false);
        this.team1Kind.show(false);
        this.team1Score.show(false);
        this.team1Bonus.show(false);

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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.State = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.State.$initClassCalled = false;

baltek.presenter.State.$initClass = function(){

    if ( baltek.presenter.State.$initClassCalled ) return;
    baltek.presenter.State.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.State, Object);

    baltek.presenter.State.prototype.$initObject = function(presenter, superState){
        this.presenter = presenter;

        if ( superState !== undefined ) {
            this.superState = superState;
        } else {
            this.superState = null;
        }
    }

    baltek.presenter.State.prototype.setState = function(newState){
        // newState and "this" must be sibbling states
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.SuperState = function(presenter, superState){
    this.$initObject(presenter, superState);
}

baltek.presenter.SuperState.$initClassCalled = false;

baltek.presenter.SuperState.$initClass = function(){

    if ( baltek.presenter.SuperState.$initClassCalled ) return;
    baltek.presenter.SuperState.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.SuperState, baltek.presenter.State);

    baltek.presenter.SuperState.prototype.$initObject = function(presenter, superState){
        baltek.presenter.SuperState.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopState = function(presenter, superState){
    this.$initObject(presenter, superState);
}

baltek.presenter.TopState.$initClassCalled = false;

baltek.presenter.TopState.$initClass = function(){

    if ( baltek.presenter.TopState.$initClassCalled ) return;
    baltek.presenter.TopState.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.TopState, baltek.presenter.SuperState);

    baltek.presenter.TopState.prototype.$initObject = function(presenter, superState){
        baltek.presenter.TopState.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowAbout = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.WhatStateShowAbout.$initClassCalled = false;

baltek.presenter.WhatStateShowAbout.$initClass = function(){

    if ( baltek.presenter.WhatStateShowAbout.$initClassCalled ) return;
    baltek.presenter.WhatStateShowAbout.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowAbout, baltek.presenter.State);

    baltek.presenter.WhatStateShowAbout.prototype.$initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowAbout.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowHelp = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.WhatStateShowHelp.$initClassCalled = false;

baltek.presenter.WhatStateShowHelp.$initClass = function(){

    if ( baltek.presenter.WhatStateShowHelp.$initClassCalled ) return;
    baltek.presenter.WhatStateShowHelp.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowHelp, baltek.presenter.State);

    baltek.presenter.WhatStateShowHelp.prototype.$initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowHelp.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatStateShowRules = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.WhatStateShowRules.$initClassCalled = false;

baltek.presenter.WhatStateShowRules.$initClass = function(){

    if ( baltek.presenter.WhatStateShowRules.$initClassCalled ) return;
    baltek.presenter.WhatStateShowRules.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowRules, baltek.presenter.State);

    baltek.presenter.WhatStateShowRules.prototype.$initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowRules.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.WhatTopState = function(presenter, superState){
    this.$initObject(presenter, superState);
};

baltek.presenter.WhatTopState.$initClassCalled = false;

baltek.presenter.WhatTopState.$initClass = function(){

    if ( baltek.presenter.WhatTopState.$initClassCalled ) return;
    baltek.presenter.WhatTopState.$initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatTopState, baltek.presenter.SuperState);

    baltek.presenter.WhatTopState.prototype.$initObject = function(presenter, superState){
        baltek.presenter.WhatTopState.super.$initObject.call(this, presenter, superState);
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
}
///////////////////////////////////////////////////////////////////////////////
