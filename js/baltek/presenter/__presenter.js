"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter = { };
baltek.presenter.__initModuleCalled = false;

baltek.presenter.__initModule = function(){

    if ( baltek.presenter.__initModuleCalled ) return;
    baltek.presenter.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.draw.__initModule();
    baltek.i18n.__initModule();
    baltek.rules.__initModule();
    baltek.utils.__initModule();
    baltek.widget.__initModule();

    // Init inner classes
    baltek.presenter.GameStateIsFinished.__initClass();
    baltek.presenter.GameStateIsReadyToStart.__initClass();
    baltek.presenter.GameStateIsReadyToQuit.__initClass();
    baltek.presenter.GameStateIsRunning.__initClass();
    baltek.presenter.GameTopState.__initClass();
    baltek.presenter.Presenter.__initClass();
    baltek.presenter.State.__initClass();
    baltek.presenter.SuperState.__initClass();
    baltek.presenter.TopState.__initClass();
    baltek.presenter.WhatStateShowAbout.__initClass();
    baltek.presenter.WhatStateShowHelp.__initClass();
    baltek.presenter.WhatStateShowRules.__initClass();
    baltek.presenter.WhatTopState.__initClass();
}
///////////////////////////////////////////////////////////////////////////////
