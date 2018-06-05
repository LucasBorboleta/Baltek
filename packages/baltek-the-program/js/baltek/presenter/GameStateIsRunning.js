"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
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
        this.presenter.goToSettings.show(true);
        this.presenter.invitation.show(true);
        this.presenter.goToHelp.show(true);

        this.presenter.disableAllButtons();
        this.presenter.quitGame.enable(true);
        this.presenter.goToSettings.enable(true);
        this.presenter.invitation.enable(true);
        this.presenter.goToHelp.enable(true);

        var iTeamAgent;
        var teamAgentKind = "" ;
        for ( iTeamAgent=0; iTeamAgent < this.presenter.teamAgents.length; iTeamAgent++) {

            if ( ! this.presenter.teamAgents[iTeamAgent].kindIsBlocked ) {

                this.presenter.teamAgents[iTeamAgent].kindIsBlocked = true;

                teamAgentKind = this.presenter.teamAgents[iTeamAgent].kind;

                if ( teamAgentKind !== "human" ) {
                    baltek.utils.assert( baltek.ai.makers[teamAgentKind] !== undefined );
                    this.presenter.teamAgents[iTeamAgent].ai = new baltek.ai.makers[teamAgentKind]();

                } else {
                    this.presenter.teamAgents[iTeamAgent].ai = null;
                }

                var ai = this.presenter.teamAgents[iTeamAgent].ai;

                if ( ai !== null ) {
                    var confirmAspect = ai.getAspect( "confirmAspect" );
                    var squareAspect = ai.getAspect( "squareAspect" );
                    var ballAspect = ai.getAspect( "ballAspect" );
                    var sprintAspect = ai.getAspect( "sprintAspect" );
                    var footballerAspect = ai.getAspect( "footballerAspect" );
                    this.presenter.teamAgents[iTeamAgent].ai.registerObserver(this.presenter, confirmAspect);
                    this.presenter.teamAgents[iTeamAgent].ai.registerObserver(this.presenter, squareAspect);
                    this.presenter.teamAgents[iTeamAgent].ai.registerObserver(this.presenter, ballAspect);
                    this.presenter.teamAgents[iTeamAgent].ai.registerObserver(this.presenter, sprintAspect);
                    this.presenter.teamAgents[iTeamAgent].ai.registerObserver(this.presenter, footballerAspect);
                }
            }
        }

        if ( ! this.presenter.rulesEngine.matchIsDefined() ) {
            this.presenter.rulesEngine.matchInit();
        }

        this.presenter.rulesEngine.matchUpdate();
    };

    baltek.presenter.GameStateIsRunning.prototype.updateFromObservable = function(observable, aspect){
        var ball = null;
        var footballer = null;
        var square = null;
        var squareIndices = null;

        if ( observable === this.presenter.quitGame ) {
            baltek.utils.Dispatcher.getInstance().resetNotifiers();
            baltek.debug.writeMessage("GameStateIsRunning: after resetNotifiers");
            this.setState(this.superState.goToGameStateIsReadyToQuit);

        } else if ( observable === this.presenter.rulesEngine ) {
            var state = this.presenter.rulesEngine.exportMoveState();
            this.presenter.updateFromEngineState(state);

            if ( ! this.presenter.rulesEngine.matchIsActive() ) {
                this.setState(this.superState.goToGameStateIsFinished);
            }

            if ( this.presenter.teamAgents[state.activeTeamIndex].ai !== null ) {
                this.presenter.teamAgents[state.activeTeamIndex].ai.updateFromEngineState(state);
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

        } else if ( observable === this.presenter.teamAgents[0].ai || observable === this.presenter.teamAgents[1].ai) {
            var ai = observable;

            var confirmAspect = ai.getAspect( "confirmAspect" );
            var squareAspect = ai.getAspect( "squareAspect" );
            var ballAspect = ai.getAspect( "ballAspect" );
            var sprintAspect = ai.getAspect( "sprintAspect" );
            var footballerAspect = ai.getAspect( "footballerAspect" );

            if ( aspect === confirmAspect ) {
                this.presenter.rulesEngine.turnConfirm();

            } else if ( aspect === squareAspect ) {
                this.presenter.rulesEngine.moveSelectSquare(ai.getSquareIndices());

            } else if ( aspect === ballAspect ) {
                this.presenter.rulesEngine.moveSelectBall(true);

            } else if ( aspect === sprintAspect ) {
                this.presenter.rulesEngine.moveSprint(true);

            } else if ( aspect === footballerAspect ) {
                this.presenter.rulesEngine.moveSelectFootballer(ai.getFootballerSquareIndices(), true);

            } else {
                baltek.utils.assert( false, "aspect not managed" );
            }

        } else {

            if ( this.superState !== null ) {
                this.superState.updateFromObservable(observable, aspect);
            } else {
                baltek.utils.assert( false, "observable not managed" );
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
