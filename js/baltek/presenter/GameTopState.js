"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.GameTopState = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameTopState.__initClassCalled = false;

baltek.presenter.GameTopState.__initClass = function(){

    if ( baltek.presenter.GameTopState.__initClassCalled ) return;
    baltek.presenter.GameTopState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameTopState, baltek.presenter.SuperState);

    baltek.presenter.GameTopState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameTopState.super.__initObject.call(this, presenter, superState);
        this.enableHistory(true);
    };

    baltek.presenter.GameTopState.prototype.atEnter = function(){
        baltek.draw.canvas.style.display = "inherit";
    };

    baltek.presenter.GameTopState.prototype.atExit = function(){
        baltek.draw.canvas.style.display = "none";
    };

    baltek.presenter.GameTopState.prototype.initSubstates = function(){
        this.gameStateIsFinished = new baltek.presenter.GameStateIsFinished(this.presenter, this);
        this.gameStateIsReadyToStart = new baltek.presenter.GameStateIsReadyToStart(this.presenter, this);
        this.gameStateIsRunning = new baltek.presenter.GameStateIsRunning(this.presenter, this);
        this.gameStateIsReadyToQuit = new baltek.presenter.GameStateIsReadyToQuit(this.presenter, this);
    };

    baltek.presenter.GameTopState.prototype.getDefaultSubstate = function(){
        return this.gameStateIsReadyToStart;
    };

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
    };
};
///////////////////////////////////////////////////////////////////////////////
