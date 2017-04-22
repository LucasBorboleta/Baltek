"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.debug = { initCalled: false };

baltek.debug.$init = function(){

    if ( ! baltek.debug.initCalled ) {
        baltek.debug.initCalled = true;

        // Init any package used by this one
        baltek.draw.$init();
        baltek.presenter.$init();

        baltek.debug.messageCount = 0;

        baltek.debug.isEnabled = ( document.getElementById( "Baltek_DebugZone" ) !== null ) ;
        baltek.debug.messages = document.getElementById( "Baltek_DebugZone_Messages" );
        baltek.debug.mousePosition = document.getElementById( "Baltek_DebugZone_Mouse" );

        if ( baltek.debug.isEnabled ) {

            baltek.draw.canvas.addEventListener('mousemove',
                function(event){
                    var mousePosition = baltek.draw.getMousePosition(event);
                    baltek.debug.mousePosition.innerHTML = "Mouse(x,y) = (" +
                        Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                        + ")" ;
                },
                false);
        }
    }
}

baltek.debug.clearMessages = function(){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messages.innerHTML = "" ;
    }
}

baltek.debug.enable = function(){
    baltek.debug.writeMessage( "Enable" );
    baltek.presenter.startGame.enable(true);
}

baltek.debug.disable = function(){
    baltek.debug.writeMessage( "Disable" );
    baltek.presenter.startGame.enable(false);
}

baltek.debug.hide = function(){
    baltek.debug.writeMessage( "Hide" );
    baltek.presenter.startGame.show(false);
}

baltek.debug.show = function(){
    baltek.debug.writeMessage( "Show" );
    baltek.presenter.startGame.show(true);
    baltek.presenter.startGame.setColor( "white" );
    baltek.presenter.startGame.setBackgroundColor( "blue" );
}

baltek.debug.writeMessage = function(text){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messageCount += 1 ;

        baltek.debug.messages.innerHTML = baltek.debug.messageCount + ":" +
                                              text + "<br/>" + baltek.debug.messages.innerHTML;
    }
}
///////////////////////////////////////////////////////////////////////////////
