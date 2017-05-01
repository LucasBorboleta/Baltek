"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.debug = { $initCalled: false };

baltek.debug.$init = function(){

    if ( ! baltek.debug.$initCalled ) {
        baltek.debug.$initCalled = true;

        // Init any package used by this one
        // No used package yet

        baltek.debug.messageCount = 0;

        baltek.debug.isEnabled = ( document.getElementById( "Baltek_DebugZone" ) !== null ) ;
        baltek.debug.messages = document.getElementById( "Baltek_DebugZone_Messages" );
        baltek.debug.mousePosition = document.getElementById( "Baltek_DebugZone_Mouse" );
    }
}

baltek.debug.clearMessages = function(){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messages.innerHTML = "" ;
    }
}

baltek.debug.hide = function(){
    baltek.debug.writeMessage("hide ...");
    var canvas = document.getElementById( "Baltek_DrawZone_Canvas" );
    var iFrame = document.getElementById( "Baltek_DrawZone_IFrame" );
    canvas.style.display = "none";
    iFrame.style.display = "inherit";
}

baltek.debug.writeMessage = function(text){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messageCount += 1 ;

        baltek.debug.messages.innerHTML = baltek.debug.messageCount + ":" +
                                              text + "<br/>" + baltek.debug.messages.innerHTML;
    }
}
///////////////////////////////////////////////////////////////////////////////
