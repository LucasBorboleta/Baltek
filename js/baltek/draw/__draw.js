"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw = { };
baltek.draw.__initModuleCalled = false;

baltek.draw.__initModule = function(){

    if ( baltek.draw.__initModuleCalled ) return;
    baltek.draw.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.style.__initModule();

    // Init inner classes
    baltek.draw.Ball.__initClass();
    baltek.draw.Box.__initClass();
    baltek.draw.Circle.__initClass();
    baltek.draw.Footballer.__initClass();
    baltek.draw.Selectable.__initClass();

    baltek.draw.canvas = document.getElementById( "baltek-canvas-field" );

    // Force the dimensions of the canvas
    var drawZone = document.getElementById( "baltek-drawZone" );
    baltek.draw.canvas.width = drawZone.offsetWidth;
    baltek.draw.canvas.height = drawZone.offsetHeight;

    baltek.draw.drawer = baltek.draw.canvas.getContext( "2d" );

    if ( baltek.debug.isEnabled ) {

        baltek.draw.canvas.addEventListener('mousemove',
            function(event){
                var mousePosition = baltek.draw.getMousePosition(event);
                baltek.debug.mousePosition.innerHTML = "Mouse(x,y) = (" +
                    Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                    + ")" ;
            },
            false);
    }
}

baltek.draw.getMousePosition = function(event){
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();
    return {
        x: event.clientX - canvasRectangle.left,
        y: event.clientY - canvasRectangle.top
    };
}

baltek.draw.setBoxLatticeDimensions = function(nx, ny){
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();

    baltek.draw.nx = nx;
    baltek.draw.ny = ny;

    // From the lattice dimension (nx, ny) computes the boxSide, etc.
    baltek.draw.boxQuantum = Math.min(
        (canvasRectangle.right  - canvasRectangle.left)/baltek.draw.nx,
        (canvasRectangle.bottom - canvasRectangle.top )/baltek.draw.ny ) ;

    baltek.draw.boxSide = baltek.draw.boxQuantum ;

    baltek.draw.circleQuantum = baltek.draw.boxQuantum/4 ;
    baltek.draw.circleRadius = baltek.draw.circleQuantum*0.75 ;
}
///////////////////////////////////////////////////////////////////////////////