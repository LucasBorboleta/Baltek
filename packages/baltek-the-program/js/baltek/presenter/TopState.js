"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopState = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.TopState.__initClassCalled = false;

baltek.presenter.TopState.__initClass = function(){

    if ( baltek.presenter.TopState.__initClassCalled ) return;
    baltek.presenter.TopState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.TopState, baltek.presenter.SuperState);

    baltek.presenter.TopState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.TopState.super.__initObject.call(this, presenter, superState);
        this.enableHistory(true);
    };

    baltek.presenter.TopState.prototype.initSubstates = function(){
        this.gameTopState = new baltek.presenter.GameTopState(this.presenter, this);
        this.whatTopState = new baltek.presenter.WhatTopState(this.presenter, this);
    };

    baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
        return this.gameTopState;
    };

    baltek.presenter.TopState.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.language ) {
            this.presenter.i18nTranslator.setLanguage(this.presenter.language.getSelection());

        } else if ( observable === this.presenter.debug ) {
                baltek.debug.toggle();

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
