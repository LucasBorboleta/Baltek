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
baltek.draw.Selectable = function(){
    this.__initObject();
};

baltek.draw.Selectable.__initClassCalled = false;
baltek.draw.Selectable.__instances = [];

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
        this.onClickWrapper = function(event){ thisSaved.onClick(event); };

        baltek.draw.Selectable.__instances.push(this);
        this.id = ( baltek.draw.Selectable.__instances.length - 1);
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

    baltek.draw.Selectable.prototype.registerObserver = function(observer){
        baltek.draw.Selectable.super.registerObserver.call(this, observer, this.selectableAspect);
    };

    baltek.draw.Selectable.prototype.select = function(condition){
        this.selected = condition;
        this.draw();
    };

    baltek.draw.Selectable.prototype.onClick = function(event){
        if (this.selectable) {
            var mousePosition = baltek.draw.getMousePosition(event);
            var clicked = this.contains(mousePosition);

            if ( clicked ) {
                baltek.debug.writeMessage( "TogetherJS is defined = " + (TogetherJS !== undefined) );
                if ( TogetherJS !== undefined && TogetherJS.running ) {
                    TogetherJS.send( { type: "canvas-abstract-click", id: this.id } );
                }
                this.onAbstractClick();
            }
        }
    };

    baltek.draw.Selectable.prototype.onAbstractClick = function(){
        // Inverse the selection status
        this.selected = (! this.selected);

        this.draw();
        this.notifyObservers(this.selectableAspect);
    };
};
///////////////////////////////////////////////////////////////////////////////
