"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
///////////////////////////////////////////////////////////////////////////////
baltek.debug = { };
baltek.debug.__initModuleCalled = false;

baltek.debug.__initModule = function(){

    if ( baltek.debug.__initModuleCalled ) return;
    baltek.debug.__initModuleCalled = true;

    // Init required modules
    baltek.widget.__initModule();

    // Init inner classes
    // None

    baltek.debug.messageCount = 0;

    baltek.debug.isEnabled = true ;
    baltek.debug.zone = new baltek.widget.Widget( "baltek-debugZone" , null);
    baltek.debug.messages = document.getElementById( "baltek-debug-messages" );
    baltek.debug.mousePosition = document.getElementById( "baltek-debug-mousePosition" );
    baltek.debug.toggle();
};

baltek.debug.clearMessages = function(){
    baltek.debug.messages.innerHTML = "" ;
};

baltek.debug.toggle = function(){
    baltek.debug.isEnabled = ( ! baltek.debug.isEnabled );
    baltek.debug.zone.show(baltek.debug.isEnabled)  ;
    if ( ! baltek.debug.isEnabled ) {
        baltek.debug.clearMessages();
    }
};

baltek.debug.writeMessage = function(text){
    if ( baltek.debug.isEnabled ) {
        baltek.debug.messageCount += 1 ;

        baltek.debug.messages.innerHTML = baltek.debug.messageCount + ":" +
                                              text + "<br/>" + baltek.debug.messages.innerHTML;
    }
};
///////////////////////////////////////////////////////////////////////////////
