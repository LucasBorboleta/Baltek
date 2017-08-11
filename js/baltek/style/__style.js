"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.style = { };
baltek.style.__initModuleCalled = false;

baltek.style.__initModule = function(){
    if ( baltek.style.__initModuleCalled ) return;
    baltek.style.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.widget.__initModule();

    // Init inner classes
    // None

    // Define colors, fonts and witdhs used by Javascript
    baltek.style.colors = { };
    baltek.style.fonts = { };
    baltek.style.widths = { };

    var BALTEK_FONT = "Verdana,sans-serif";
    var BALTEK_YELLOW = "#FFFF00";
    var BALTEK_GREEN_0 = "#006600";
    var BALTEK_GREEN_1 = "#5C8A00";

    baltek.style.colors.CIRCLE_BACKGROUND = "gray";
    baltek.style.colors.CIRCLE_BORDER = "black";
    baltek.style.colors.CIRCLE_TEXT = "black";
    baltek.style.fonts.CIRCLE_TEXT = "24px" + " " + BALTEK_FONT;
    baltek.style.widths.CIRCLE_BORDER = "5";

    baltek.style.colors.CIRCLE_BORDER_SELECTED = BALTEK_YELLOW;

    // Retrieve team colors from existing HTML elements that are already parmetrized thanks to CCS
    baltek.style.colors.TEAM_0 = baltek.widget.getStylePropertyValue( "baltek-counter-team0Score", "background-color" );
    baltek.style.colors.TEAM_1 = baltek.widget.getStylePropertyValue( "baltek-counter-team1Score", "background-color" );

    baltek.style.colors.BALL_BACKGROUND = "white";
    baltek.style.colors.BALL_BORDER = "white";

    baltek.style.colors.BALL_BORDER_SELECTED = BALTEK_YELLOW;
    baltek.style.colors.BALL_BACKGROUND_SELECTED = BALTEK_YELLOW;

    baltek.style.colors.SQUARE_TEXT = "white";
    baltek.style.fonts.SQUARE_TEXT = "16px" + " " + BALTEK_FONT;
    baltek.style.widths.SQUARE_BORDER = "5";

    baltek.style.colors.SQUARE_BORDER_SELECTED = BALTEK_YELLOW;

    baltek.style.colors.SQUARE_0 = BALTEK_GREEN_0;
    baltek.style.colors.SQUARE_1 = BALTEK_GREEN_1;

    baltek.style.colors.TEAM_COLORS = [];
    baltek.style.colors.TEAM_COLORS.push(null);
    baltek.style.colors.TEAM_COLORS.push(null);
    baltek.style.colors.TEAM_COLORS[0] = baltek.style.colors.TEAM_0;
    baltek.style.colors.TEAM_COLORS[1] = baltek.style.colors.TEAM_1;
};
///////////////////////////////////////////////////////////////////////////////
