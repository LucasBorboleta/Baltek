"use strict";
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
