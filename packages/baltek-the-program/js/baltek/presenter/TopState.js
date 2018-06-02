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
        this.goToGameTopState = new baltek.presenter.GameTopState(this.presenter, this);
        this.goToHelpTopState = new baltek.presenter.WhatTopState(this.presenter, this);
        this.goToSettingsState = new baltek.presenter.SettingsState(this.presenter, this);
    };

    baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
        return this.goToGameTopState;
    };

    baltek.presenter.TopState.prototype.updateFromObservable = function(observable, aspect){

        if ( observable === this.presenter.clearMessages ) {
            baltek.debug.clearMessages();
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
