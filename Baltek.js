"use strict";
///////////////////////////////////////////////////////////////////////////////
var baltek = { };
baltek.$initPackageCalled = false;

baltek.$initPackage = function(){

    if ( baltek.$initPackageCalled ) return;
    baltek.$initPackageCalled = true;

    // Init required packages
    baltek.debug.$initPackage();
    baltek.presenter.$initPackage();

    // Init inner classes
    // None

    baltek.thePresenter = new baltek.presenter.Presenter();
    baltek.debug.writeMessage( "baltek.$initPackage(): done" );
}
///////////////////////////////////////////////////////////////////////////////
