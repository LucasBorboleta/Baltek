"use strict";
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
