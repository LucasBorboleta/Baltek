"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL [https://github.com/LucasBorboleta/baltek-the-program](https://github.com/LucasBorboleta/baltek-the-program).

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses](http://www.gnu.org/licenses).
BALTEK-THE-PROGRAM-LICENSE-MD-END */
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
        this.presenter.goToSettings.show(true);
        this.presenter.invitation.show(true);
        this.presenter.goToHelp.show(true);

        this.presenter.disableAllButtons();
        this.presenter.startGame.enable(true);
        this.presenter.goToSettings.enable(true);
        this.presenter.invitation.enable(true);
        this.presenter.goToHelp.enable(true);
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
            this.setState(this.superState.goToGameStateIsRunning);

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
