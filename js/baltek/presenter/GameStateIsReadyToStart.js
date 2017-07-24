"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameStateIsReadyToStart = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsReadyToStart.__initClassCalled = false;

baltek.presenter.GameStateIsReadyToStart.__initClass = function(){

    if ( baltek.presenter.GameStateIsReadyToStart.__initClassCalled ) return;
    baltek.presenter.GameStateIsReadyToStart.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsReadyToStart, baltek.presenter.State);

    baltek.presenter.GameStateIsReadyToStart.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsReadyToStart.super.__initObject.call(this, presenter, superState);
    };

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
    };

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
    };
};
///////////////////////////////////////////////////////////////////////////////
