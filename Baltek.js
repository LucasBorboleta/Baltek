"use strict";
///////////////////////////////////////////////////////////////////////////////
var baltek = { $initCalled: false };

baltek.$init = function(){
    if ( ! baltek.$initCalled ) {
        baltek.$initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
        baltek.presenter.$init();

        baltek.thePresenter = new baltek.presenter.Presenter();
        baltek.debug.writeMessage( "baltek.$init(): done" );
    }
}
///////////////////////////////////////////////////////////////////////////////
