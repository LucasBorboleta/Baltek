"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Selectable = function(){
    this.__initObject();
}

baltek.draw.Selectable.__initClassCalled = false;

baltek.draw.Selectable.__initClass = function(){

    if ( baltek.draw.Selectable.__initClassCalled ) return;
    baltek.draw.Selectable.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Selectable, Object);

    baltek.draw.Selectable.prototype.__initObject = function(){
        this.selectable = false;
        this.selected = false;

        var thisSaved = this;
        this.onClickWrapper = function(event){ thisSaved.onclick(event); };
    }

    baltek.draw.Selectable.prototype.contains = function(point){
        return false;
    }

    baltek.draw.Selectable.prototype.disableSelection = function(){
        baltek.draw.canvas.removeEventListener('click', this.onClickWrapper , false);
        this.selectable = false;
        this.draw();
    }

    baltek.draw.Selectable.prototype.draw = function(){
    }

    baltek.draw.Selectable.prototype.enableSelection = function(){
        baltek.draw.canvas.addEventListener('click', this.onClickWrapper , false);
        this.selectable = true;
        this.draw();
    }

    baltek.draw.Selectable.prototype.onclick = function(event){
        baltek.utils.assert(this.selectable);

        var mousePosition = baltek.draw.getMousePosition(event);
        var clicked = this.contains(mousePosition);

        if ( clicked ) {
            // Inverse the selection status
            this.selected = (! this.selected);
            this.update();
            this.draw();
        }
    }

    baltek.draw.Selectable.prototype.update = function(){
    }
}
///////////////////////////////////////////////////////////////////////////////
