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
baltek.presenter.WhatStateShowRules = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.WhatStateShowRules.__initClassCalled = false;

baltek.presenter.WhatStateShowRules.__initClass = function(){

    if ( baltek.presenter.WhatStateShowRules.__initClassCalled ) return;
    baltek.presenter.WhatStateShowRules.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowRules, baltek.presenter.State);

    baltek.presenter.WhatStateShowRules.prototype.__initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowRules.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.WhatStateShowRules.prototype.enter = function(){
        this.presenter.rulesIFrame.show(true);

        this.presenter.rules.enable(false);
        this.presenter.tutorial.enable(true);
        this.presenter.guide.enable(true);
        this.presenter.about.enable(true);
    };

    baltek.presenter.WhatStateShowRules.prototype.exit = function(){
        this.presenter.rulesIFrame.show(false);

        this.presenter.rules.enable(false);
        this.presenter.tutorial.enable(false);
        this.presenter.guide.enable(false);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowRules.prototype.updateFromObservable = function(observable, aspect){
        baltek.debug.writeMessage("WhatStateShowRules.prototype.updateFromObservable");

        if ( observable === this.presenter.tutorial ) {
            this.setState(this.superState.goToHelpStateShowTutorial);

        } else if ( observable === this.presenter.guide ) {
            this.setState(this.superState.goToHelpStateShowHelp);

        } else if ( observable === this.presenter.about ) {
            this.setState(this.superState.goToHelpStateShowAbout);

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
