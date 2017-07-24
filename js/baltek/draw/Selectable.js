"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Selectable = function(){
    this.__initObject();
};

baltek.draw.Selectable.__initClassCalled = false;

baltek.draw.Selectable.__initClass = function(){

    if ( baltek.draw.Selectable.__initClassCalled ) return;
    baltek.draw.Selectable.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Selectable, baltek.utils.Observable);

    baltek.draw.Selectable.prototype.__initObject = function(){
        baltek.draw.Selectable.super.__initObject.call(this);
        this.selectableAspect = this.newAspect("selectableAspect");

        this.selectable = false;
        this.selected = false;

        var thisSaved = this;
        this.onClickWrapper = function(event){ thisSaved.onclick(event); };
    };

    baltek.draw.Selectable.prototype.contains = function(point){
        return false;
    };

    baltek.draw.Selectable.prototype.draw = function(){
    };

    baltek.draw.Selectable.prototype.enableSelection = function(condition){
        if ( condition ) {
            baltek.draw.canvas.addEventListener( "click" , this.onClickWrapper , false);
        } else {
            baltek.draw.canvas.removeEventListener( "click" , this.onClickWrapper , false);
        }
        this.selectable = condition;
        this.draw();
    };

    baltek.draw.Selectable.prototype.select = function(condition){
        this.selected = condition;
        this.draw();
    };

    baltek.draw.Selectable.prototype.onclick = function(event){
        if (this.selectable) {
            var mousePosition = baltek.draw.getMousePosition(event);
            var clicked = this.contains(mousePosition);

            if ( clicked ) {
                // Inverse the selection status
                this.selected = (! this.selected);
                this.draw();
                this.notifyObservers();
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
