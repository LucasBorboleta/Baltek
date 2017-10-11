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
        var isImplemented = true;
        if ( observable === this.presenter.team0Kind ) {
            this.presenter.team0Agent.kind = this.presenter.team0Kind.getSelection();
            isImplemented = ( this.presenter.team0Agent.kind == "human");
            baltek.debug.writeMessage( "GameStateIsReadyToStart: team0Kind=" + this.presenter.team0Agent.kind +
                                            " ; implemented=" + isImplemented);

        } else if ( observable === this.presenter.team1Kind ) {
            this.presenter.team1Agent.kind = this.presenter.team1Kind.getSelection();
            isImplemented = ( this.presenter.team0Agent.kind == "human");
            baltek.debug.writeMessage( "GameStateIsReadyToStart: team1Kind=" + this.presenter.team1Agent.kind +
                                            " ; implemented=" + isImplemented);

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
