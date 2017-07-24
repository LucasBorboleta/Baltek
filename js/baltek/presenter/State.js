"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.State = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.State.__initClassCalled = false;

baltek.presenter.State.__initClass = function(){

    if ( baltek.presenter.State.__initClassCalled ) return;
    baltek.presenter.State.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.State, Object);

    baltek.presenter.State.prototype.__initObject = function(presenter, superState){
        this.presenter = presenter;

        if ( superState !== undefined ) {
            this.superState = superState;
        } else {
            this.superState = null;
        }
    };

    baltek.presenter.State.prototype.setState = function(newState){
        // newState and "this" must be sibbling states
        baltek.utils.assert( newState !== null );
        baltek.utils.assert( newState.superState !== null );
        baltek.utils.assert( newState.superState === this.superState );

        this.exit();
        newState.superState.substate = newState;
        this.presenter.state = newState;
        this.presenter.state.enter();
    };

    baltek.presenter.State.prototype.enter = function(){
    };

    baltek.presenter.State.prototype.exit = function(){
    };

    baltek.presenter.State.prototype.updateFromObservable = function(observable){
        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
