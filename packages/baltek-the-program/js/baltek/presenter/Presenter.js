"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.Presenter = function(){
    this.__initObject();
};

baltek.presenter.Presenter.__initClassCalled = false;

baltek.presenter.Presenter.__initClass = function(){

    if ( baltek.presenter.Presenter.__initClassCalled ) return;
    baltek.presenter.Presenter.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.Presenter, Object);

    baltek.presenter.Presenter.prototype.__initObject = function(){
        this.rulesEngine = new baltek.rules.Engine();
        this.rulesEngine.registerObserver(this);

        var SCORE_MAX = this.rulesEngine.getScoreMax();

        var BONUS_MAX = this.rulesEngine.getBonusMax();
        var BONUS_ZERO_SYMBOL = "-";
        var BONUS_ONE_SYMBOL = "*";

        var CREDIT_MAX = this.rulesEngine.getCreditMax();
        var CREDIT_ZERO_SYMBOL = "-";
        var CREDIT_ONE_SYMBOL = "$";

        this.teamAgents = [];
        this.teamAgents[0] = { kindIsBlocked: false, kind: "", ai: null };
        this.teamAgents[1] = { kindIsBlocked: false, kind: "", ai: null };

        this.i18nTranslator = new baltek.i18n.Translator(baltek.i18n.translations, "fr" );

        this.startGame = new baltek.widget.Button( "baltek-button-startGame" , this.i18nTranslator);
        this.startGame.registerObserver(this);

        this.restartGame = new baltek.widget.Button( "baltek-button-restartGame" , this.i18nTranslator);
        this.restartGame.registerObserver(this);

        this.resumeGame = new baltek.widget.Button( "baltek-button-resumeGame" , this.i18nTranslator );
        this.resumeGame.registerObserver(this);

        this.quitGame = new baltek.widget.Button( "baltek-button-quitGame" , this.i18nTranslator);
        this.quitGame.registerObserver(this);

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

        this.sprint = new baltek.widget.Selector( "baltek-select-sprint", this.i18nTranslator, [ "no", "yes" ] );
        this.sprint.registerObserver(this);

        this.confirm = new baltek.widget.Button( "baltek-button-confirm" , this.i18nTranslator);
        this.confirm.registerObserver(this);

        this.undo = new baltek.widget.Button( "baltek-button-undo" , this.i18nTranslator);
        this.undo.registerObserver(this);

        this.credit = new baltek.widget.CounterWithSymbols( "baltek-counter-credit" , this.i18nTranslator,
            CREDIT_MAX, CREDIT_ZERO_SYMBOL, CREDIT_ONE_SYMBOL);

        this.invitation = new baltek.widget.Button( "baltek-button-invitation" , this.i18nTranslator);
        this.invitation.registerObserver(this);

        this.goToSettings = new baltek.widget.Button( "baltek-button-goToSettings" , this.i18nTranslator);
        this.goToSettings.registerObserver(this);

        this.goToHelp = new baltek.widget.Button( "baltek-button-goToHelp" , this.i18nTranslator);
        this.goToHelp.registerObserver(this);

        this.settingsZone = new baltek.widget.Zone( "baltek-settingsZone" );
        this.settingsZone.show(false);

        this.goToGame = new baltek.widget.Button( "baltek-button-goToGame" , this.i18nTranslator);
        this.goToGame.registerObserver(this);

        this.team0Kind = new baltek.widget.Selector( "baltek-select-team0Kind", this.i18nTranslator, [ "human", "ai1", "ai2", "ai3" ] );
        this.team0Kind.registerObserver(this);
        this.team0Kind.setBackgroundColor(baltek.style.colors.TEAM_COLORS[0]);
        this.teamAgents[0].kind = this.team0Kind.getSelection();

        this.team1Kind = new baltek.widget.Selector( "baltek-select-team1Kind", this.i18nTranslator, [ "human", "ai1", "ai2", "ai3" ] );
        this.team1Kind.registerObserver(this);
        this.team1Kind.setBackgroundColor(baltek.style.colors.TEAM_COLORS[1]);
        this.teamAgents[1].kind = this.team1Kind.getSelection();

        this.coordinates = new baltek.widget.Selector( "baltek-select-coordinates", this.i18nTranslator, [ "no", "yes" ] );
        this.coordinates.registerObserver(this);
        this.coordinates.setSelection("no");

        this.language = new baltek.widget.Selector( "baltek-select-language", this.i18nTranslator,
            this.i18nTranslator.getAvailableLanguages() );
        this.language.registerObserver(this);
        this.language.setSelection(this.i18nTranslator.getLanguage());

        this.debug = new baltek.widget.Selector( "baltek-select-debug", this.i18nTranslator, [ "no", "yes" ] );
        this.debug.registerObserver(this);
        if ( baltek.debug.isEnabled ) {
            this.debug.setSelection( "yes" );
        } else {
            this.debug.setSelection( "no" );
        }

        this.clearMessages = new baltek.widget.Button( "baltek-debug-clearMessages" , this.i18nTranslator);
        this.clearMessages.registerObserver(this);

        this.tutorialZone = new baltek.widget.Zone( "baltek-tutorialZone" );
        this.tutorialZone.show(false);

        this.pictureSlider = new baltek.widget.PictureSlider( "baltek-picture-slider" , this.i18nTranslator);
        this.textSlider = new baltek.widget.TextSlider( "baltek-text-slider" , this.i18nTranslator);

        this.previous = new baltek.widget.Button( "baltek-button-previous" , this.i18nTranslator);
        this.previous.registerObserver(this);

        this.page = new baltek.widget.CounterWithFraction( "baltek-counter-page" , this.i18nTranslator);

        this.next = new baltek.widget.Button( "baltek-button-next" , this.i18nTranslator);
        this.next.registerObserver(this);

        this.tutorial = new baltek.widget.Button( "baltek-button-tutorial" , this.i18nTranslator);
        this.tutorial.registerObserver(this);

        this.guideIFrame = new baltek.widget.IFrame( "baltek-iframe-guide" , this.i18nTranslator);
        this.guide = new baltek.widget.Button( "baltek-button-guide" , this.i18nTranslator);
        this.guide.registerObserver(this);

        this.rulesIFrame = new baltek.widget.IFrame( "baltek-iframe-rules" , this.i18nTranslator);
        this.rules = new baltek.widget.Button( "baltek-button-rules" , this.i18nTranslator);
        this.rules.registerObserver(this);

        this.aboutIFrame = new baltek.widget.IFrame( "baltek-iframe-about" , this.i18nTranslator);
        this.about = new baltek.widget.Button( "baltek-button-about" , this.i18nTranslator);
        this.about.registerObserver(this);

        this.ballWatcher = new baltek.draw.BallWatcher();
        this.ballWatcher.registerObserver(this);

        this.squareWatcher = new baltek.draw.SquareWatcher();
        this.squareWatcher.registerObserver(this);

        this.footballerWatcher = new baltek.draw.FootballerWatcher();
        this.footballerWatcher.registerObserver(this);

        this.initField();
        this.initBall();
        this.initFootballers();
        this.drawField();
        this.initTutorial();

        this.state = new baltek.presenter.TopState(this, null);
        this.state.enter();
    };

    baltek.presenter.Presenter.prototype.clearSquares = function(){
        var ix = 0;
        var iy = 0;
        var square = null;
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            for (iy=0; iy < this.draw.fieldNy; iy++) {
                square = this.draw.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.clear();
                }
            }
        }
    };

    baltek.presenter.Presenter.prototype.disableAllButtons = function(){
        this.startGame.enable(false);
        this.restartGame.enable(false);
        this.resumeGame.enable(false);
        this.quitGame.enable(false);

        this.sprint.enable(false);
        this.confirm.enable(false);
        this.undo.enable(false);
        this.credit.enable(false);

        this.invitation.enable(false);
        this.goToSettings.enable(false);
        this.goToHelp.enable(false);

        this.goToGame.enable(false);

        this.team0Kind.enable(false);
        this.team1Kind.enable(false);
        this.coordinates.enable(false);
        this.language.enable(false);
        this.debug.enable(false);

        this.previous.enable(false);
        this.next.enable(false);

        this.tutorial.enable(false);
        this.rules.enable(false);
        this.guide.enable(false);
        this.about.enable(false);
    };

    baltek.presenter.Presenter.prototype.drawField = function(){
        var ix = 0;
        var iy = 0;
        var square = null;
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            for (iy=0; iy < this.draw.fieldNy; iy++) {
                square = this.draw.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.draw();
                }
            }
        }
    };

    baltek.presenter.Presenter.prototype.hideAllButtons = function(){
        this.startGame.show(false);
        this.restartGame.show(false);
        this.resumeGame.show(false);
        this.quitGame.show(false);

        this.team0Bonus.show(false);
        this.team0Score.show(false);
        this.team1Score.show(false);
        this.team1Bonus.show(false);

        this.sprint.show(false);
        this.confirm.show(false);
        this.undo.show(false);
        this.credit.show(false);

        this.invitation.show(false);
        this.goToSettings.show(false);
        this.goToHelp.show(false);

        this.goToGame.show(false);

        this.team0Kind.show(false);
        this.team1Kind.show(false);
        this.coordinates.show(false);
        this.language.show(false);
        this.debug.show(false);

        this.previous.show(false);
        this.page.show(false);
        this.next.show(false);

        this.tutorial.show(false);
        this.rules.show(false);
        this.guide.show(false);
        this.about.show(false);
    };

    baltek.presenter.Presenter.prototype.initBall = function(){
        this.draw.ball = new baltek.draw.Ball();
        this.draw.ball.registerObserver(this.ballWatcher);
    };

    baltek.presenter.Presenter.prototype.initField = function(){
        this.draw = {};
        this.draw.fieldNx = this.rulesEngine.getFieldNx();
        this.draw.fieldNy = this.rulesEngine.getFieldNy();
        baltek.draw.setSquareLatticeDimensions(this.draw.fieldNx, this.draw.fieldNy);

        this.draw.xLabels = [];
        var letters = "abcdefghijklmnopqrstuvwxyz".split("");
        baltek.utils.assert( this.draw.fieldNx <= letters.length );
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            this.draw.xLabels[ix] = letters[ix];
        }

        this.draw.yLabels = [];
        var digits = "123456789".split("");
        baltek.utils.assert( this.draw.fieldNy <= digits.length);
        for (iy=0; iy < this.draw.fieldNy; iy++) {
            this.draw.yLabels[iy] = digits[this.draw.fieldNy - iy - 1];
        }

        this.draw.squaresByIndices = [] ;

        var ix = 0;
        var iy = 0;
        var square = null;
        var xyLabel = "";
        var text = "";
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            this.draw.squaresByIndices.push([]);

            for (iy=0; iy < this.draw.fieldNy; iy++) {
                this.draw.squaresByIndices[ix].push(null);

                if ( this.rulesEngine.hasFieldSquare(ix, iy) ) {
                    xyLabel = this.draw.xLabels[ix] + this.draw.yLabels[iy];
                    if ( this.rulesEngine.hasGoalSquare(ix, iy) ) {
                        text = "#";
                    } else {
                        text = "";
                    }
                    square = new baltek.draw.Square(ix, iy, xyLabel, text);
                    square.registerObserver(this.squareWatcher);
                    this.draw.squaresByIndices[ix][iy] = square;
                }
            }
        }
    };

    baltek.presenter.Presenter.prototype.initFootballers = function(){
        this.draw.teams = [];
        this.draw.teams[0] = {};
        this.draw.teams[1] = {};
        this.draw.teams[0].footballers = [];
        this.draw.teams[1].footballers = [];

        var teamIndex = 0;
        var teamCount = 2;

        var footballerCount = 0;
        var footballerIndex = 0;
        var footballerForce = 0;
        var footballer = null;

        for (teamIndex=0; teamIndex<teamCount; teamIndex++) {
            footballerCount = this.rulesEngine.getFooballerCount(teamIndex);

            for (footballerIndex=0; footballerIndex<footballerCount; footballerIndex++) {
                footballerForce = this.rulesEngine.getFooballerForce(teamIndex, footballerIndex);
                footballer = new baltek.draw.Footballer(teamIndex, footballerForce);
                footballer.registerObserver(this.footballerWatcher);
                this.draw.teams[teamIndex].footballers[footballerIndex] = footballer;
            }
        }
    };

    baltek.presenter.Presenter.prototype.initTutorial = function(){
        var slides = baltek.i18n.tutorial;

        baltek.utils.assert( slides.pictures.length === slides.texts.length );
        var n=slides.pictures.length;
        var i=0;
        for (i=0; i<n; i++) {
            this.pictureSlider.add( slides.pictures[i] );
            this.textSlider.add( slides.texts[i] );
        }

        /// Sanity checks
        baltek.utils.assert( this.pictureSlider.count() === this.textSlider.count() );

        /// Go to first slides
        this.pictureSlider.moveFirst();
        this.textSlider.moveFirst();
    }

    baltek.presenter.Presenter.prototype.showXYLabels = function(condition){
        var ix = 0;
        var iy = 0;
        var square = null;
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            for (iy=0; iy < this.draw.fieldNy; iy++) {
                square = this.draw.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.showXYLabel(condition);
                }
            }
        }
    };

    baltek.presenter.Presenter.prototype.updateFromObservable = function(observable, aspect){
        this.state.updateFromObservable(observable, aspect);
    };

    baltek.presenter.Presenter.prototype.updateFromEngineBallState = function(state){
        var ballIndices = state.squareIndices;
        var ballSquare = this.draw.squaresByIndices[ballIndices.ix][ballIndices.iy];
        ballSquare.setBall(this.draw.ball);
        this.draw.ball.enableSelection(state.selectable);
        this.draw.ball.select(state.selected);
    };

    baltek.presenter.Presenter.prototype.updateFromEngineFieldState = function(state){
        var ix = 0;
        var iy = 0;
        var square = null;
        for (ix=0; ix < this.draw.fieldNx; ix++) {
            for (iy=0; iy < this.draw.fieldNy; iy++) {
                square = this.draw.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.enableSelection(state.squaresByIndices[ix][iy].selectable);
                    square.select(state.squaresByIndices[ix][iy].selected);
                }
            }
        }
    };

    baltek.presenter.Presenter.prototype.updateFromEngineTeamState = function(state){
        var teamIndex = state.teamIndex;
        var team = this.draw.teams[teamIndex];
        var footballerCount = this.draw.teams[teamIndex].footballers.length;
        var footballerIndex = 0;
        var footballer = null;
        var footballerState = null;
        var footballerIndices = null;
        var footballerSquare = null;

        for (footballerIndex=0; footballerIndex<footballerCount; footballerIndex++) {
            footballer = team.footballers[footballerIndex];
            footballerState = state.footballers[footballerIndex];
            footballerIndices = footballerState.squareIndices;
            footballerSquare = this.draw.squaresByIndices[footballerIndices.ix][footballerIndices.iy];
            footballerSquare.setFootballer(footballer);
            footballer.enableSelection(footballerState.selectable);
            footballer.enableKick(footballerState.canKick);
            footballer.enableRun(footballerState.canRun);
            footballer.select(footballerState.selected);
        }
    };

    baltek.presenter.Presenter.prototype.updateFromEngineState = function(state){
        this.team0Score.show(true);
        this.team1Score.show(true);
        this.team0Score.setCount( state.teams[0].score );
        this.team1Score.setCount( state.teams[1].score );

        this.team0Bonus.show(true);
        this.team1Bonus.show(true);
        this.team0Bonus.setCount( Number(state.teams[0].sprintCount) );
        this.team1Bonus.setCount( Number(state.teams[1].sprintCount) );

        var activeTeamIndex = state.activeTeamIndex;
        this.credit.show(true);
        this.credit.setCount( state.teams[activeTeamIndex].credit );
        this.credit.setBackgroundColor( baltek.style.colors.TEAM_COLORS[activeTeamIndex] );

        this.sprint.show(true);
        this.sprint.enable(state.teams[activeTeamIndex].sprintCount !== 0);

        if ( state.sprint ) {
            this.sprint.setSelection( "yes" );
        } else {
            this.sprint.setSelection( "no" );
        }

        this.confirm.show(true);
        this.confirm.enable(true);

        this.undo.show(true);
        this.undo.enable( state.teams[activeTeamIndex].credit < this.rulesEngine.getCreditMax() );

        this.clearSquares();

        this.updateFromEngineBallState(state.ball);
        this.updateFromEngineFieldState(state.field);
        this.updateFromEngineTeamState(state.teams[0]);
        this.updateFromEngineTeamState(state.teams[1]);
    };
};
///////////////////////////////////////////////////////////////////////////////
