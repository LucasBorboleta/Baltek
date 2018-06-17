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
baltek.presenter.SettingsState = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.SettingsState.__initClassCalled = false;

baltek.presenter.SettingsState.__initClass = function(){

    if ( baltek.presenter.SettingsState.__initClassCalled ) return;
    baltek.presenter.SettingsState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.SettingsState, baltek.presenter.State);

    baltek.presenter.SettingsState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.SettingsState.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.SettingsState.prototype.enter = function(){
        this.presenter.settingsZone.style.display = "inherit";

        this.presenter.hideAllButtons();
        this.presenter.goToGame.show(true);
        this.presenter.goToSettings.show(true);
        this.presenter.team0Kind.show(true);
        this.presenter.team1Kind.show(true);
        this.presenter.language.show(true);
        this.presenter.coordinates.show(true);
        this.presenter.debug.show(true);

        this.presenter.disableAllButtons();
        this.presenter.goToGame.enable(true);
        this.presenter.goToSettings.enable(false);
        this.presenter.team0Kind.enable( ! this.presenter.teamAgents[0].kindIsBlocked);
        this.presenter.team1Kind.enable( ! this.presenter.teamAgents[1].kindIsBlocked);
        this.presenter.language.enable(true);
        this.presenter.coordinates.enable(true);
        this.presenter.debug.enable(true);
    };

    baltek.presenter.SettingsState.prototype.exit = function(){
        this.presenter.settingsZone.style.display = "none";
    }

    baltek.presenter.SettingsState.prototype.updateFromObservable = function(observable, aspect){

        if ( observable === this.presenter.team0Kind ) {
            baltek.utils.assert( ! this.presenter.teamAgents[0].kindIsBlocked )
            this.presenter.teamAgents[0].kind = this.presenter.team0Kind.getSelection();

        } else if ( observable === this.presenter.team1Kind ) {
            baltek.utils.assert( ! this.presenter.teamAgents[1].kindIsBlocked )
            this.presenter.teamAgents[1].kind = this.presenter.team1Kind.getSelection();

        } else if ( observable === this.presenter.goToGame ) {
            this.setState(this.superState.goToGameTopState);

        } else if ( observable === this.presenter.language ) {
            this.presenter.i18nTranslator.setLanguage(this.presenter.language.getSelection());

        } else if ( observable === this.presenter.coordinates ) {
            this.presenter.showXYLabels( this.presenter.coordinates.getSelection() === "yes" );

        } else if ( observable === this.presenter.debug ) {
            baltek.debug.enable( this.presenter.debug.getSelection() === "yes" );

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
