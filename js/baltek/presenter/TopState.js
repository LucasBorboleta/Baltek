"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopState = function(presenter, superState){
    this.__initObject(presenter, superState);
}

baltek.presenter.TopState.__initClassCalled = false;

baltek.presenter.TopState.__initClass = function(){

    if ( baltek.presenter.TopState.__initClassCalled ) return;
    baltek.presenter.TopState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.TopState, baltek.presenter.SuperState);

    baltek.presenter.TopState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.TopState.super.__initObject.call(this, presenter, superState);
        this.enableHistory(true);
    }

    baltek.presenter.TopState.prototype.initSubstates = function(){
        this.gameTopState = new baltek.presenter.GameTopState(this.presenter, this);
        this.whatTopState = new baltek.presenter.WhatTopState(this.presenter, this);
    }

    baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
        return this.gameTopState;
    }

    baltek.presenter.TopState.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.language ) {
            this.presenter.i18nTranslator.setLanguage(this.presenter.language.getSelection());

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
