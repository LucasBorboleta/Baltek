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
baltek.presenter.SuperState = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.SuperState.__initClassCalled = false;

baltek.presenter.SuperState.__initClass = function(){

    if ( baltek.presenter.SuperState.__initClassCalled ) return;
    baltek.presenter.SuperState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.SuperState, baltek.presenter.State);

    baltek.presenter.SuperState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.SuperState.super.__initObject.call(this, presenter, superState);
        this.substate = null;
        this.enabledHistory = false;
        this.initSubstates();
    };

    baltek.presenter.SuperState.prototype.atEnter = function(){
    };

    baltek.presenter.SuperState.prototype.atExit = function(){
    };

    baltek.presenter.SuperState.prototype.enableHistory = function(condition){
        this.enabledHistory = condition;
    };

    baltek.presenter.SuperState.prototype.enter = function(){
        this.atEnter();

        if ( this.substate === null ) {
            this.substate = this.getDefaultSubstate();
            baltek.utils.assert( this.substate !== null );
        }

        this.presenter.state = this.substate;
        this.presenter.state.enter();
    };

    baltek.presenter.SuperState.prototype.exit = function(){
        this.atExit();

        this.substate.exit();

        if ( ! this.enabledHistory ) {
            this.substate = null;
        }
    };

    baltek.presenter.SuperState.prototype.getDefaultSubstate = function(){
        baltek.utils.assert( false, "must be redefined" );
        return null;
    };

    baltek.presenter.SuperState.prototype.initSubstates = function(){
        baltek.utils.assert( false, "must be redefined" );
    };
};
///////////////////////////////////////////////////////////////////////////////
