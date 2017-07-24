"use strict";
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
        this.presenter.help.enable(true);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowAbout.prototype.exit = function(){
        this.presenter.aboutIFrame.show(false);

        this.presenter.rules.enable(false);
        this.presenter.help.enable(false);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowAbout.prototype.updateFromObservable = function(observable){

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
