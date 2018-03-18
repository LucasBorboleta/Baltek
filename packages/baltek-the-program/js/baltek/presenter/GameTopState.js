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
        this.goToGameStateIsFinished = new baltek.presenter.GameStateIsFinished(this.presenter, this);
        this.goToGameStateIsReadyToStart = new baltek.presenter.GameStateIsReadyToStart(this.presenter, this);
        this.goToGameStateIsRunning = new baltek.presenter.GameStateIsRunning(this.presenter, this);
        this.goToGameStateIsReadyToQuit = new baltek.presenter.GameStateIsReadyToQuit(this.presenter, this);
    };

    baltek.presenter.GameTopState.prototype.getDefaultSubstate = function(){
        return this.goToGameStateIsReadyToStart;
    };

    baltek.presenter.GameTopState.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.goToSettings ) {
            this.setState(this.superState.goToSettingsState);

        } else if ( observable === this.presenter.invitation ) {
            TogetherJS();

        } else if ( observable === this.presenter.goToHelp ) {
            this.setState(this.superState.goToHelpTopState);

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
