"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.color = { initCalled: false };

baltek.color.$init = function(){
    if ( ! baltek.color.initCalled ) {
        baltek.color.initCalled = true;

        // Init any package used by this one
        // No used package yet

        // Define all the colors used in Baltek
        // Only the standard colors are defined by names
        // Others are defined in hexdecimal.
        baltek.color.BLACK = "black";
        baltek.color.BLUE = "#0099CC";
        baltek.color.GRAY = "gray";
        baltek.color.GREEN_1 = "#006600";
        baltek.color.GREEN_2 = "#5C8A00";
        baltek.color.RED = "#E62E00";
        baltek.color.WHITE = "white";
        baltek.color.YELLOW = "#FFFF00";
    }
}
///////////////////////////////////////////////////////////////////////////////
