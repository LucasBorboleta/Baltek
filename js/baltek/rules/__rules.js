"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules = { };
baltek.rules.__initModuleCalled = false;

baltek.rules.__initModule = function(){

    if ( baltek.rules.__initModuleCalled ) return
    baltek.rules.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.utils.__initModule();

    // Init inner classes
    baltek.rules.Ball.__initClass();
    baltek.rules.Box.__initClass();
    baltek.rules.Engine.__initClass();
    baltek.rules.Field.__initClass();
    baltek.rules.Footballer.__initClass();
    baltek.rules.Team.__initClass();
}
///////////////////////////////////////////////////////////////////////////////
