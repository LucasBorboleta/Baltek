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
baltek.presenter.WhatStateShowHelp = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.WhatStateShowHelp.__initClassCalled = false;

baltek.presenter.WhatStateShowHelp.__initClass = function(){

    if ( baltek.presenter.WhatStateShowHelp.__initClassCalled ) return;
    baltek.presenter.WhatStateShowHelp.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowHelp, baltek.presenter.State);

    baltek.presenter.WhatStateShowHelp.prototype.__initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowHelp.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.WhatStateShowHelp.prototype.enter = function(){
        this.presenter.helpIFrame.show(true);

        this.presenter.rules.enable(true);
        this.presenter.help.enable(false);
        this.presenter.about.enable(true);
    };

    baltek.presenter.WhatStateShowHelp.prototype.exit = function(){
        this.presenter.helpIFrame.show(false);

        this.presenter.rules.enable(false);
        this.presenter.help.enable(false);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowHelp.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.rules ) {
            this.setState(this.superState.whatStateShowRules);

        } else if ( observable === this.presenter.help ) {
            this.setState(this.superState.whatStateShowHelp);

        } else if ( observable === this.presenter.about ) {
            this.setState(this.superState.whatStateShowAbout);

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
