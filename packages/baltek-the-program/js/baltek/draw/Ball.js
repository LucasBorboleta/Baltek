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
baltek.draw.Ball = function(){
    this.__initObject();
};

baltek.draw.Ball.__initClassCalled = false;

baltek.draw.Ball.__initClass = function(){

    if ( baltek.draw.Ball.__initClassCalled ) return;
    baltek.draw.Ball.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Ball, baltek.draw.Disk);

    baltek.draw.Ball.prototype.__initObject = function(){
        baltek.draw.Ball.super.__initObject.call(this);

        this.fillStyle = baltek.style.colors.BALL_BACKGROUND ;
        this.fillStyleSelected = baltek.style.colors.BALL_BACKGROUND_SELECTED;
        this.strokeStyle = baltek.style.colors.BALL_BORDER;
        this.strokeStyleSelected = baltek.style.colors.BALL_BORDER_SELECTED;

        this.text = "@";
    };
};
///////////////////////////////////////////////////////////////////////////////
