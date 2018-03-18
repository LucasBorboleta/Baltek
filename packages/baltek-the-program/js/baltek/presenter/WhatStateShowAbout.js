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
baltek.presenter.WhatStateShowAbout = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.WhatStateShowAbout.__initClassCalled = false;

baltek.presenter.WhatStateShowAbout.__initClass = function(){

    if ( baltek.presenter.WhatStateShowAbout.__initClassCalled ) return;
    baltek.presenter.WhatStateShowAbout.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowAbout, baltek.presenter.State);

    baltek.presenter.WhatStateShowAbout.prototype.__initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowAbout.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.WhatStateShowAbout.prototype.enter = function(){
        this.presenter.aboutIFrame.show(true);

        this.presenter.rules.enable(true);
        this.presenter.guide.enable(true);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowAbout.prototype.exit = function(){
        this.presenter.aboutIFrame.show(false);

        this.presenter.rules.enable(false);
        this.presenter.guide.enable(false);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowAbout.prototype.updateFromObservable = function(observable){

        if ( observable === this.presenter.rules ) {
            this.setState(this.superState.goToHelpStateShowRules);

        } else if ( observable === this.presenter.guide ) {
            this.setState(this.superState.goToHelpStateShowHelp);

        } else if ( observable === this.presenter.about ) {
            this.setState(this.superState.goToHelpStateShowAbout);

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
