"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.debug = { };
baltek.debug.__initModuleCalled = false;

baltek.debug.__initModule = function(){

    if ( baltek.debug.__initModuleCalled ) return;
    baltek.debug.__initModuleCalled = true;

    // Init required modules
    // None

    // Init inner classes
    // None

    baltek.debug.messageCount = 0;

    baltek.debug.isEnabled = ( document.getElementById( "baltek-debugZone" ) !== null ) ;
    baltek.debug.messages = document.getElementById( "baltek-debug-messages" );
    baltek.debug.mousePosition = document.getElementById( "baltek-debug-mousePosition" );
}

baltek.debug.clearMessages = function(){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messages.innerHTML = "" ;
    }
}

baltek.debug.writeMessage = function(text){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messageCount += 1 ;

        baltek.debug.messages.innerHTML = baltek.debug.messageCount + ":" +
                                              text + "<br/>" + baltek.debug.messages.innerHTML;
    }
}
///////////////////////////////////////////////////////////////////////////////
