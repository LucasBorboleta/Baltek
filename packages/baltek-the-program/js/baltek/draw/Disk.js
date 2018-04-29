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
baltek.draw.Disk = function(){
    this.__initObject();
};

baltek.draw.Disk.__initClassCalled = false;

baltek.draw.Disk.__initClass = function(){

    if ( baltek.draw.Disk.__initClassCalled ) return;
    baltek.draw.Disk.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Disk, baltek.draw.Selectable);

    baltek.draw.Disk.prototype.__initObject = function(){
        baltek.draw.Disk.super.__initObject.call(this);

        this.square = null;
        this.x = undefined;
        this.y = undefined;
        this.text = null;

        this.radius = baltek.draw.diskRadius;

        this.strokeStyle = baltek.style.colors.DISK_BORDER;
        this.strokeStyleSelected = baltek.style.colors.DISK_BORDER_SELECTED;
        this.fillStyle = baltek.style.colors.DISK_BACKGROUND;
        this.fillStyleSelected = baltek.style.colors.DISK_BACKGROUND;
    };

    baltek.draw.Disk.prototype.contains = function(point){
        var contains = false;
        if ( this.x !== undefined && this.y !== undefined ) {
            var dx = point.x - this.x;
            var dy = point.y - this.y;
            var r = this.radius;
            contains = ( (dx*dx + dy*dy) < r*r );
        }
        return contains;
    };

    baltek.draw.Disk.prototype.draw = function(){

        if ( this.square !== null && this.x !== undefined && this.y !== undefined ) {

            baltek.draw.drawer.strokeStyle = this.strokeStyle;
            baltek.draw.drawer.fillStyle = this.fillStyle;
            if ( this.selected ) {
                baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
                baltek.draw.drawer.fillStyle = this.fillStyleSelected;
            }

            baltek.draw.drawer.lineWidth = baltek.style.widths.DISK_BORDER;

            var lw = baltek.draw.drawer.lineWidth;
            baltek.draw.drawer.beginPath();
            baltek.draw.drawer.arc(this.x,this.y,this.radius -lw/2, 0,2*Math.PI);
            baltek.draw.drawer.stroke();

            baltek.draw.drawer.arc(this.x,this.y,this.radius - lw/2, 0,2*Math.PI);
            baltek.draw.drawer.fill();

            if ( this.text !== null ) {
                baltek.draw.drawer.fillStyle = baltek.style.colors.DISK_TEXT;
                baltek.draw.drawer.font = baltek.style.fonts.DISK_TEXT;
                baltek.draw.drawer.textBaseline = "middle";
                baltek.draw.drawer.textAlign = "center";
                baltek.draw.drawer.fillText(this.text, this.x, this.y);
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
