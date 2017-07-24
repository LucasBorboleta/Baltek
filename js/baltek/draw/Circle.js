"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Circle = function(){
    this.__initObject();
};

baltek.draw.Circle.__initClassCalled = false;

baltek.draw.Circle.__initClass = function(){

    if ( baltek.draw.Circle.__initClassCalled ) return;
    baltek.draw.Circle.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Circle, baltek.draw.Selectable);

    baltek.draw.Circle.prototype.__initObject = function(){
        baltek.draw.Circle.super.__initObject.call(this);

        this.box = null;
        this.x = undefined;
        this.y = undefined;
        this.text = null;

        this.radius = baltek.draw.circleRadius;

        this.strokeStyle = baltek.style.colors.CIRCLE_BORDER;
        this.strokeStyleSelected = baltek.style.colors.CIRCLE_BORDER_SELECTED;
        this.fillStyle = baltek.style.colors.CIRCLE_BACKGROUND;
        this.fillStyleSelected = baltek.style.colors.CIRCLE_BACKGROUND;
    };

    baltek.draw.Circle.prototype.contains = function(point){
        var contains = false;
        if ( this.x !== undefined && this.y !== undefined ) {
            var dx = point.x - this.x;
            var dy = point.y - this.y;
            var r = this.radius;
            contains = ( (dx*dx + dy*dy) < r*r );
        }
        return contains;
    };

    baltek.draw.Circle.prototype.draw = function(){

        if ( this.box !== null && this.x !== undefined && this.y !== undefined ) {

            baltek.draw.drawer.strokeStyle = this.strokeStyle;
            baltek.draw.drawer.fillStyle = this.fillStyle;
            if ( this.selected ) {
                baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
                baltek.draw.drawer.fillStyle = this.fillStyleSelected;
            }

            baltek.draw.drawer.lineWidth = baltek.style.widths.CIRCLE_BORDER;

            var lw = baltek.draw.drawer.lineWidth;
            baltek.draw.drawer.beginPath();
            baltek.draw.drawer.arc(this.x,this.y,this.radius -lw/2, 0,2*Math.PI);
            baltek.draw.drawer.stroke();

            baltek.draw.drawer.arc(this.x,this.y,this.radius - lw/2, 0,2*Math.PI);
            baltek.draw.drawer.fill();

            if ( this.text !== null ) {
                baltek.draw.drawer.fillStyle = baltek.style.colors.CIRCLE_TEXT;
                baltek.draw.drawer.font = baltek.style.fonts.CIRCLE_TEXT;
                baltek.draw.drawer.textBaseline = "middle";
                baltek.draw.drawer.textAlign = "center";
                baltek.draw.drawer.fillText(this.text, this.x, this.y);
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
