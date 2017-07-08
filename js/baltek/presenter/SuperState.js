"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.SuperState = function(presenter, superState){
    this.__initObject(presenter, superState);
}

baltek.presenter.SuperState.__initClassCalled = false;

baltek.presenter.SuperState.__initClass = function(){

    if ( baltek.presenter.SuperState.__initClassCalled ) return;
    baltek.presenter.SuperState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.SuperState, baltek.presenter.State);

    baltek.presenter.SuperState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.SuperState.super.__initObject.call(this, presenter, superState);
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
