"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw = { initCalled: false };

baltek.draw.$init = function(){
    if ( ! baltek.draw.initCalled ) {
        baltek.draw.initCalled = true;

        // Init any package used by this one
        // No used package yet

        baltek.draw.canvas = document.getElementById( "Baltek_CanvasZone_Canvas" );
        baltek.draw.rectangle = baltek.draw.canvas.getBoundingClientRect();
        baltek.draw.drawer = baltek.draw.canvas.getContext( "2d" );
    }
}

baltek.draw.getMousePosition = function(event){
    return {
      x: event.clientX + window.pageXOffset - baltek.draw.rectangle.left,
      y: event.clientY + window.pageYOffset - baltek.draw.rectangle.top
    };
}
///////////////////////////////////////////////////////////////////////////////
