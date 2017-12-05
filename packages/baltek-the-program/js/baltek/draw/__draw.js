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
baltek.draw = { };
baltek.draw.__initModuleCalled = false;

baltek.draw.__initModule = function(){

    if ( baltek.draw.__initModuleCalled ) return;
    baltek.draw.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.style.__initModule();
    baltek.utils.__initModule();

    // Init inner classes
    baltek.draw.Ball.__initClass();
    baltek.draw.BallWatcher.__initClass();
    baltek.draw.Disk.__initClass();
    baltek.draw.Footballer.__initClass();
    baltek.draw.FootballerWatcher.__initClass();
    baltek.draw.Selectable.__initClass();
    baltek.draw.Square.__initClass();
    baltek.draw.SquareWatcher.__initClass();

    baltek.draw.canvas = document.getElementById( "baltek-canvas-field" );

    // Force the dimensions of the canvas
    var drawZone = document.getElementById( "baltek-drawZone" );
    baltek.draw.canvas.width = drawZone.offsetWidth;
    baltek.draw.canvas.height = drawZone.offsetHeight;

    baltek.draw.drawer = baltek.draw.canvas.getContext( "2d" );

    // Debug the mouse position when inside the canvas
    baltek.draw.canvas.addEventListener( "mousemove" ,
        function(event){
            var mousePosition = baltek.draw.getMousePosition(event);
            baltek.debug.mousePosition.innerHTML = "Mouse(x,y) = (" +
                Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                + ")" ;
        },
        false);
};

baltek.draw.getMousePosition = function(event){
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();
    return {
        x: event.clientX - canvasRectangle.left,
        y: event.clientY - canvasRectangle.top
    };
};

baltek.draw.setSquareLatticeDimensions = function(nx, ny){
    baltek.draw.nx = nx;
    baltek.draw.ny = ny;

    // From the lattice dimension (nx, ny) computes the squareSide, etc.
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();

    baltek.draw.squareQuantum = Math.min(
        (canvasRectangle.right  - canvasRectangle.left)/baltek.draw.nx,
        (canvasRectangle.bottom - canvasRectangle.top )/baltek.draw.ny ) ;

    baltek.draw.squareSide = baltek.draw.squareQuantum ;

    baltek.draw.diskQuantum = baltek.draw.squareQuantum/4 ;
    baltek.draw.diskRadius = baltek.draw.diskQuantum*0.75 ;
};
///////////////////////////////////////////////////////////////////////////////
