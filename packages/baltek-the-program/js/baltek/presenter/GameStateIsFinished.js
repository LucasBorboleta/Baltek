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
baltek.presenter.GameStateIsFinished = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.GameStateIsFinished.__initClassCalled = false;

baltek.presenter.GameStateIsFinished.__initClass = function(){

    if ( baltek.presenter.GameStateIsFinished.__initClassCalled ) return;
    baltek.presenter.GameStateIsFinished.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.GameStateIsFinished, baltek.presenter.State);

    baltek.presenter.GameStateIsFinished.prototype.__initObject = function(presenter, superState){
        baltek.presenter.GameStateIsFinished.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.GameStateIsFinished.prototype.enter = function(){
        this.presenter.hideAllButtons();
        this.presenter.restartGame.show(true);
        this.presenter.team0Score.show(true);
        this.presenter.team1Score.show(true);
        this.presenter.goToSettings.show(true);
        this.presenter.invitation.show(true);
        this.presenter.goToHelp.show(true);

        this.presenter.disableAllButtons();
        this.presenter.restartGame.enable(true);
        this.presenter.goToSettings.enable(true);
        this.presenter.invitation.enable(true);
        this.presenter.goToHelp.enable(true);
    };

    baltek.presenter.GameStateIsFinished.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.restartGame ) {
            this.presenter.rulesEngine.matchInit();
            this.setState(this.superState.goToGameStateIsReadyToStart);

        } else if ( observable === this.presenter.quitGame ) {
            this.setState(this.superState.goToGameStateIsFinished);

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
