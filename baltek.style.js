"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.style = { $initCalled: false };

baltek.style.$init = function(){
    if ( ! baltek.style.$initCalled ) {
        baltek.style.$initCalled = true;

        // Init any package used by this one
        // No used package yet

        // Define widths for lines
        baltek.style.LINE_WIDTH = 5;

        // Define fonts
        baltek.style.XY_LABEL_FONT = "16px arial";

        // Define all the colors used in Baltek
        // Only the standard colors are defined by names
        // Others are defined in hexdecimal.
        baltek.style.colors = { };
        baltek.style.colors.BLACK = "black";
        baltek.style.colors.BLUE = "#0099CC";
        baltek.style.colors.GRAY = "gray";
        baltek.style.colors.GREEN_1 = "#006600";
        baltek.style.colors.GREEN_2 = "#5C8A00";
        baltek.style.colors.RED = "#E62E00";
        baltek.style.colors.WHITE = "white";
        baltek.style.colors.YELLOW = "#FFFF00";
    }
}
///////////////////////////////////////////////////////////////////////////////
