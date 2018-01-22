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
baltek.presenter.WhatTopState = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.WhatTopState.__initClassCalled = false;

baltek.presenter.WhatTopState.__initClass = function(){

    if ( baltek.presenter.WhatTopState.__initClassCalled ) return;
    baltek.presenter.WhatTopState.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatTopState, baltek.presenter.SuperState);

    baltek.presenter.WhatTopState.prototype.__initObject = function(presenter, superState){
        baltek.presenter.WhatTopState.super.__initObject.call(this, presenter, superState);
        this.enableHistory(true);
    };

    baltek.presenter.WhatTopState.prototype.atEnter = function(){
        this.presenter.rulesIFrame.show(false);
        this.presenter.helpIFrame.show(false);
        this.presenter.aboutIFrame.show(false);

        this.presenter.hideAllButtons();
        this.presenter.language.show(true);
        this.presenter.game.show(true);
        this.presenter.rules.show(true);
        this.presenter.help.show(true);
        this.presenter.about.show(true);

        this.presenter.disableAllButtons();
        this.presenter.language.enable(true);
        this.presenter.game.enable(true);
    };

    baltek.presenter.WhatTopState.prototype.atExit = function(){
        this.presenter.rulesIFrame.show(false);
        this.presenter.helpIFrame.show(false);
        this.presenter.aboutIFrame.show(false);
    };

    baltek.presenter.WhatTopState.prototype.initSubstates = function(){
        this.whatStateShowRules = new baltek.presenter.WhatStateShowRules(this.presenter, this);
        this.whatStateShowHelp = new baltek.presenter.WhatStateShowHelp(this.presenter, this);
        this.whatStateShowAbout = new baltek.presenter.WhatStateShowAbout(this.presenter, this);
    };

    baltek.presenter.WhatTopState.prototype.getDefaultSubstate = function(){
        return this.whatStateShowHelp;
    };

    baltek.presenter.WhatTopState.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.game ) {
            this.setState(this.superState.gameTopState);

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
