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
baltek.presenter.State = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.State.__initClassCalled = false;

baltek.presenter.State.__initClass = function(){

    if ( baltek.presenter.State.__initClassCalled ) return;
    baltek.presenter.State.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.State, Object);

    baltek.presenter.State.prototype.__initObject = function(presenter, superState){
        this.presenter = presenter;

        if ( superState !== undefined ) {
            this.superState = superState;
        } else {
            this.superState = null;
        }
    };

    baltek.presenter.State.prototype.setState = function(newState){
        // newState and "this" must be sibbling states
        baltek.utils.assert( newState !== null );
        baltek.utils.assert( newState.superState !== null );
        baltek.utils.assert( newState.superState === this.superState );

        this.exit();
        newState.superState.substate = newState;
        this.presenter.state = newState;
        this.presenter.state.enter();
    };

    baltek.presenter.State.prototype.enter = function(){
    };

    baltek.presenter.State.prototype.exit = function(){
    };

    baltek.presenter.State.prototype.updateFromObservable = function(observable){
        if ( this.superState !== null ) {
            this.superState.updateFromObservable(observable);
        } else {
            baltek.utils.assert( false, "observable not managed" );
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
