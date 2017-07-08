"use strict";
///////////////////////////////////////////////////////////////////////////////
var baltek = { };
baltek.__initModuleCalled = false;

baltek.__initModule = function(){

    if ( baltek.__initModuleCalled ) return;
    baltek.__initModuleCalled = true;

    // Init required packages
    baltek.debug.__initModule();
    baltek.presenter.__initModule();

    // Init inner classes
    // None

    baltek.thePresenter = new baltek.presenter.Presenter();
    baltek.debug.writeMessage( "baltek.__initModule(): done" );
}
///////////////////////////////////////////////////////////////////////////////
