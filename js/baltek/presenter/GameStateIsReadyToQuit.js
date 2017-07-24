"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToQuit = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsReadyToQuit.__initClassCalled = false;

baltek.presenter.GameStateIsReadyToQuit.__initClass = function(){

    if ( baltek.presenter.GameStateIsReadyToQuit.__initClassCalled ) return;
    baltek.presenter.GameStateIsReadyToQuit.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsReadyToQuit, baltek.presenter.State);

    baltek.presenter.GameStateIsReadyToQuit.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsReadyToQuit.super.__initObject.call(this, presenter, superState);
    };

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
    };

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
    };
};
///////////////////////////////////////////////////////////////////////////////
