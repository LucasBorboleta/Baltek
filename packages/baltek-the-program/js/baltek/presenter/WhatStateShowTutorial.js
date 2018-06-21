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
baltek.presenter.WhatStateShowTutorial = function(presenter, superState){
    this.__initObject(presenter, superState);
};

baltek.presenter.WhatStateShowTutorial.__initClassCalled = false;

baltek.presenter.WhatStateShowTutorial.__initClass = function(){

    if ( baltek.presenter.WhatStateShowTutorial.__initClassCalled ) return;
    baltek.presenter.WhatStateShowTutorial.__initClassCalled = true;

    baltek.utils.inherit(baltek.presenter.WhatStateShowTutorial, baltek.presenter.State);

    baltek.presenter.WhatStateShowTutorial.prototype.__initObject = function(presenter, superState){
        baltek.presenter.WhatStateShowTutorial.super.__initObject.call(this, presenter, superState);
    };

    baltek.presenter.WhatStateShowTutorial.prototype.enter = function(){
        this.presenter.tutorialZone.show(true);

        this.presenter.rules.enable(true);
        this.presenter.tutorial.enable(false);
        this.presenter.guide.enable(true);
        this.presenter.about.enable(true);

        this.presenter.previous.enable(true);
        this.presenter.next.enable(true);

        this.presenter.previous.show(true);
        this.presenter.next.show(true);
        this.presenter.page.show(true);

        this.updateMoveButtons();
    };

    baltek.presenter.WhatStateShowTutorial.prototype.exit = function(){
        this.presenter.tutorialZone.show(false);

        this.presenter.rules.enable(false);
        this.presenter.tutorial.enable(false);
        this.presenter.guide.enable(false);
        this.presenter.about.enable(false);

        this.presenter.previous.show(false);
        this.presenter.next.show(false);
        this.presenter.page.show(false);
    };

    baltek.presenter.WhatStateShowTutorial.prototype.updateFromObservable = function(observable, aspect){

        if ( observable === this.presenter.rules ) {
            this.setState(this.superState.goToHelpStateShowRules);

        } else if ( observable === this.presenter.guide ) {
            this.setState(this.superState.goToHelpStateShowHelp);

        } else if ( observable === this.presenter.about ) {
            this.setState(this.superState.goToHelpStateShowAbout);

        } else if ( observable === this.presenter.next ) {
            this.presenter.pictureSlider.moveNext();
            this.presenter.textSlider.moveNext();

        } else if ( observable === this.presenter.previous ) {
            this.presenter.pictureSlider.movePrevious();
            this.presenter.textSlider.movePrevious();

        } else {

            if ( this.superState !== null ) {
                this.superState.updateFromObservable(observable, aspect);
            } else {
                baltek.utils.assert( false, "observable not managed" );
            }
        }

        this.updateMoveButtons();
    };

    baltek.presenter.WhatStateShowTutorial.prototype.updateMoveButtons = function(){
        this.presenter.previous.enable( this.presenter.pictureSlider.canMovePrevious() );
        this.presenter.next.enable( this.presenter.pictureSlider.canMoveNext() );
        this.presenter.page.setMaximum( this.presenter.pictureSlider.count() );
        this.presenter.page.setCount( this.presenter.pictureSlider.getIndex() + 1 );
    };

};
///////////////////////////////////////////////////////////////////////////////
