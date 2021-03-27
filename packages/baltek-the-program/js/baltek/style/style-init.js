"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
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

    if ( ! baltek.isInteractive ) return;

    // Define colors, fonts and witdhs used by Javascript
    baltek.style.colors = { };
    baltek.style.fonts = { };
    baltek.style.widths = { };

    var BALTEK_FONT = baltek.widget.getStylePropertyValue( "baltek-body", "font-family" );
    var BALTEK_YELLOW = "#F2CB05";
    var BALTEK_GREEN_0 = "#898F39";
    var BALTEK_GREEN_1 = "#404224"; 

    baltek.style.colors.DISK_BACKGROUND = "gray";
    baltek.style.colors.DISK_BORDER = "black";
    baltek.style.colors.DISK_TEXT = "black";
    baltek.style.fonts.DISK_TEXT = "24px" + " " + BALTEK_FONT;
    baltek.style.widths.DISK_BORDER = "5";

    baltek.style.colors.DISK_BORDER_SELECTED = BALTEK_YELLOW;

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
