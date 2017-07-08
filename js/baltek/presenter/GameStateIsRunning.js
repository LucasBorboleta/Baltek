"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsRunning = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsRunning.__initClassCalled = false;

baltek.presenter.GameStateIsRunning.__initClass = function(){

    if ( baltek.presenter.GameStateIsRunning.__initClassCalled ) return;
    baltek.presenter.GameStateIsRunning.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsRunning, baltek.presenter.State);

    baltek.presenter.GameStateIsRunning.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsRunning.super.__initObject.call(this, presenter, superState);
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
