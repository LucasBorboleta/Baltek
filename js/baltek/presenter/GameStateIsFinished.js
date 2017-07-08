"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsFinished = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsFinished.__initClassCalled = false;

baltek.presenter.GameStateIsFinished.__initClass = function(){

    if ( baltek.presenter.GameStateIsFinished.__initClassCalled ) return;
    baltek.presenter.GameStateIsFinished.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsFinished, baltek.presenter.State);

    baltek.presenter.GameStateIsFinished.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsFinished.super.__initObject.call(this, presenter, superState);
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
