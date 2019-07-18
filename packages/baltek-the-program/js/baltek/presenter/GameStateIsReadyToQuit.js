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
baltek.presenter.GameStateIsReadyToQuit = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsReadyToQuit.__initClassCalled = false;

baltek.presenter.GameStateIsReadyToQuit.__initClass = function(){

    if ( baltek.presenter.GameStateIsReadyToQuit.__initClassCalled ) return;
    baltek.presenter.GameStateIsReadyToQuit.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsReadyToQuit, baltek.presenter.State);

    baltek.presenter.GameStateIsReadyToQuit.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsReadyToQuit.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.GameStateIsReadyToQuit.prototype.enter = function(){

        baltek.debug.writeMessage("GameStateIsReadyToQuit.prototype.enter");

        this.presenter.hideAllButtons();
        this.presenter.resumeGame.show(true);
        this.presenter.quitGame.show(true);
        this.presenter.team0Bonus.show(true);
        this.presenter.team0Score.show(true);
        this.presenter.team1Score.show(true);
        this.presenter.team1Bonus.show(true);
        this.presenter.goToSettings.show(true);
        this.presenter.invitation.show(true);
        this.presenter.goToHelp.show(true);

        this.presenter.disableAllButtons();
        this.presenter.resumeGame.enable(true);
        this.presenter.quitGame.enable(true);
        this.presenter.goToSettings.enable(true);
        this.presenter.invitation.enable(true);
        this.presenter.goToHelp.enable(true);
    };

    baltek.presenter.GameStateIsReadyToQuit.prototype.updateFromObservable = function(observable, aspect){
        baltek.debug.writeMessage("GameStateIsReadyToQuit.prototype.updateFromObservable");

        if ( observable === this.presenter.resumeGame ) {
            this.setState(this.superState.goToGameStateIsRunning);

        } else if ( observable === this.presenter.quitGame ) {
            this.setState(this.superState.goToGameStateIsFinished);

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
