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
    };

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

        if ( this.presenter.rulesEngine.match === undefined ) {
            this.presenter.rulesEngine.matchInit();
        }
        this.presenter.rulesEngine.matchUpdate();
    };

    baltek.presenter.GameStateIsRunning.prototype.updateFromObservable = function(observable){
        var boxIndices = null;

        if ( observable === this.presenter.quitGame ) {
            this.setState(this.superState.gameStateIsReadyToQuit);

        } else if ( observable === this.presenter.rulesEngine ) {
            var state = this.presenter.rulesEngine.exportState();
            this.presenter.updateFromEngineState(state);

            if ( ! this.presenter.rulesEngine.match.isActive) {
                this.setState(this.superState.gameStateIsFinished);
            }

        } else if ( observable === this.presenter.ballWatcher ) {
            this.presenter.rulesEngine.moveSelectBall(observable.ball.selected);

        } else if ( observable === this.presenter.footballerWatcher ) {
            boxIndices = {ix:observable.footballer.box.ix, iy:observable.footballer.box.iy};
            this.presenter.rulesEngine.moveSelectFootballer(boxIndices, observable.footballer.selected);

        } else if ( observable === this.presenter.boxWatcher ) {
            boxIndices = {ix:observable.box.ix, iy:observable.box.iy};
            this.presenter.rulesEngine.moveSelectBox(boxIndices);

        } else if ( observable === this.presenter.sprint ) {
            this.presenter.rulesEngine.moveSprint( observable.getSelection() === "yes" );

        } else if ( observable === this.presenter.undo ) {
            this.presenter.rulesEngine.turnUndo();

        } else if ( observable === this.presenter.confirm ) {
            this.presenter.rulesEngine.turnConfirm();

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
