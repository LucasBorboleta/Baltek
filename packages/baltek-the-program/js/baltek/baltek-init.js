"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
var baltek = { };
baltek.__initModuleCalled = false;

baltek.__initModule = function(){

    if ( baltek.__initModuleCalled ) return;
    baltek.__initModuleCalled = true;

    // Detect the interactive context, in order to ease BALTEK loading in unit tests
    baltek.isInteractive = ( document.getElementById( "baltek-body" ) !== null );

    // CAUTION-1: Dispatcher is needed when two AI are used !!!
    // CAUTION-2: Using two browsers syncrhonized using TogetherJS does not work with a Dispatcher !!!

    // Use AI ?
    baltek.useAI = true

    // Use a Dispatcher ?
    baltek.useDispatcher = false;

    // Init required packages
    baltek.debug.__initModule();
    baltek.debug.enable( false );

    baltek.presenter.__initModule();

    // Init inner classes
    // None

    // Hide the pleaseWait message
    if ( baltek.isInteractive ) {
        document.getElementById( "baltek-text-pleaseWait" ).style.display = "none";
    }

    baltek.debug.writeMessage( "baltek.__initModule(): done" );

    if ( baltek.isInteractive ) {
        baltek.debug.writeMessage( "baltek.__initModule(): TogetherJS is defined = " + (TogetherJS !== undefined) );
    }
};

baltek.startGame = function(){
    // Create and start an instance of Presenter that handles the application
    baltek.thePresenter = new baltek.presenter.Presenter();

    // TogetherJS settings
    if ( TogetherJS !== undefined ) {

        //FIXME: Together Hub server hosted by TogetherJS seems to be no longer supported !
        //FIXME: can it be replaced by another existing server ?
        //TogetherJSConfig_hubBase = "https://togetherjs-hub.glitch.me/";
        //TogetherJSConfig_hubBase = "https://hub.framaestro.org";

        TogetherJS.hub.on( "canvas-abstract-click",
            function(msg){
                if ( ! msg.sameUrl ) {
                    return;
                }
                baltek.debug.writeMessage( "TogetherJS.hub: receiving canvas-abstract-click id=" + msg.id );
                baltek.draw.Selectable.__instances[msg.id].onAbstractClick();
            }
        );
    }

    if ( baltek.useDispatcher ) {
        baltek.utils.Dispatcher.getInstance().start();
    }
};
///////////////////////////////////////////////////////////////////////////////
