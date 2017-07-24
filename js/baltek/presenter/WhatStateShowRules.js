"use strict";
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
        this.presenter.help.enable(true);
        this.presenter.about.enable(true);
    };

    baltek.presenter.WhatStateShowRules.prototype.exit = function(){
        this.presenter.rulesIFrame.show(false);

        this.presenter.rules.enable(false);
        this.presenter.help.enable(false);
        this.presenter.about.enable(false);
    };

    baltek.presenter.WhatStateShowRules.prototype.updateFromObservable = function(observable){

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
