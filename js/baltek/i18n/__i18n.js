"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.i18n = { };
baltek.i18n.__initModuleCalled = false;

baltek.i18n.__initModule = function(){
    if ( baltek.i18n.__initModuleCalled ) return;
    baltek.i18n.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.utils.__initModule();

    // Init inner classes
    baltek.i18n.Translator.__initClass();
};
///////////////////////////////////////////////////////////////////////////////
