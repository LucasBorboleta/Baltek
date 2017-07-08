"use strict";
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
