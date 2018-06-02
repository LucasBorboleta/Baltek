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
baltek.ai.AI2 = function(){
    this.__initObject();
};

baltek.ai.AI2.__initClassCalled = false;

baltek.ai.AI2.__initClass = function(){

    if ( baltek.ai.AI2.__initClassCalled ) return;
    baltek.ai.AI2.__initClassCalled = true;

    baltek.utils.inherit(baltek.ai.AI2, baltek.ai.AI);

    baltek.ai.AI2.prototype.__initObject = function(){
        baltek.ai.AI2.super.__initObject.call(this);
    };

    baltek.ai.AI2.prototype.updateFromEngineState = function(state){
        baltek.debug.writeMessage( "From AI2:" );
        this.randomDecision(state);
    };
};
///////////////////////////////////////////////////////////////////////////////
