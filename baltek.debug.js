"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.debug = { };
baltek.debug.$initPackageCalled = false;

baltek.debug.$initPackage = function(){

    if ( baltek.debug.$initPackageCalled ) return;
    baltek.debug.$initPackageCalled = true;

    // Init required packages
    // None

    // Init inner classes
    // None

    baltek.debug.messageCount = 0;

    baltek.debug.isEnabled = ( document.getElementById( "Baltek_DebugZone" ) !== null ) ;
    baltek.debug.messages = document.getElementById( "Baltek_DebugZone_Messages" );
    baltek.debug.mousePosition = document.getElementById( "Baltek_DebugZone_Mouse" );
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
