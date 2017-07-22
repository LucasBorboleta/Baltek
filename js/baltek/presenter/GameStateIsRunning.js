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
        this.presenter.coordinates.show(true);
        this.presenter.language.show(true);
        this.presenter.what.show(true);

        this.presenter.disableAllButtons();
        this.presenter.quitGame.enable(true);
        this.presenter.coordinates.enable(true);
        this.presenter.language.enable(true);
        this.presenter.what.enable(true);

        this.presenter.rulesEngine.matchInit();
    }

    baltek.presenter.GameStateIsRunning.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.quitGame ) {
            this.setState(this.superState.gameStateIsReadyToQuit);

        } else if ( observable === this.presenter.rulesEngine ) {
            var state = this.presenter.rulesEngine.exportState();
            this.presenter.updateFromEngineState(state);

        } else if ( observable === this.presenter.ballWatcher ) {
            baltek.debug.writeMessage( "GameStateIsRunning: ball selected=" +
                observable.ball.selected +
                " at box(" + observable.ball.box.ix + ","  + observable.ball.box.iy + ")" );

        } else if ( observable === this.presenter.footballerWatcher ) {
            baltek.debug.writeMessage( "GameStateIsRunning: footballer selected=" +
                observable.footballer.selected +
                " at box(" + observable.footballer.box.ix + ","  + observable.footballer.box.iy + ")" );

        } else if ( observable === this.presenter.boxWatcher ) {
            baltek.debug.writeMessage( "GameStateIsRunning: box selected=" +
                observable.box.selected +
                " at (" + observable.box.ix + ","  + observable.box.iy + ")" );

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
