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
        this.presenter.settings.show(true);
        this.presenter.invitation.show(true);
        this.presenter.what.show(true);

        this.presenter.disableAllButtons();
        this.presenter.quitGame.enable(true);
        this.presenter.settings.enable(true);
        this.presenter.invitation.enable(true);
        this.presenter.what.enable(true);

        if ( ! this.presenter.rulesEngine.matchIsDefined() ) {
            this.presenter.rulesEngine.matchInit();
        }
        this.presenter.rulesEngine.matchUpdate();
    };

    baltek.presenter.GameStateIsRunning.prototype.updateFromObservable = function(observable){
        var ball = null;
        var footballer = null;
        var square = null;
        var squareIndices = null;

        if ( observable === this.presenter.quitGame ) {
            this.setState(this.superState.gameStateIsReadyToQuit);

        } else if ( observable === this.presenter.rulesEngine ) {
            var state = this.presenter.rulesEngine.exportMoveState();
            this.presenter.updateFromEngineState(state);

            if ( ! this.presenter.rulesEngine.matchIsActive() ) {
                this.setState(this.superState.gameStateIsFinished);
            }

        } else if ( observable === this.presenter.ballWatcher ) {
            ball = this.presenter.ballWatcher.getBall();
            this.presenter.rulesEngine.moveSelectBall(observable.ball.selected);

        } else if ( observable === this.presenter.footballerWatcher ) {
            footballer = this.presenter.footballerWatcher.getFootballer();
            squareIndices = {ix:footballer.square.ix, iy:footballer.square.iy};
            this.presenter.rulesEngine.moveSelectFootballer(squareIndices, observable.footballer.selected);

        } else if ( observable === this.presenter.squareWatcher ) {
            square = this.presenter.squareWatcher.getSquare();
            squareIndices = {ix:square.ix, iy:square.iy};
            this.presenter.rulesEngine.moveSelectSquare(squareIndices);

        } else if ( observable === this.presenter.sprint ) {
            this.presenter.rulesEngine.moveSprint( observable.getSelection() === "yes" );

        } else if ( observable === this.presenter.undo ) {
            this.presenter.rulesEngine.turnCancel();

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
