"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.style = { $initCalled: false };

baltek.style.$init = function(){
    if ( ! baltek.style.$initCalled ) {
        baltek.style.$initCalled = true;

        // Init any package used by this one
        baltek.utils.$init();

        // Define colors, fonts and witdhs used by Javascript
        // All information is retrieved from pseudo DOM elements parametrized elsewhere using CSS 
        baltek.style.colors = { };
        baltek.style.fonts = { };
        baltek.style.widths = { };

        baltek.style.colors.CIRCLE_BACKGROUND = baltek.utils.getStylePropertyValue( "baltek-circle", "background-color" );
        baltek.style.colors.CIRCLE_BORDER = baltek.utils.getStylePropertyValue( "baltek-circle", "border-color" );
        baltek.style.colors.CIRCLE_TEXT = baltek.utils.getStylePropertyValue( "baltek-circle", "color" );
        baltek.style.fonts.CIRCLE_TEXT = baltek.utils.getStylePropertyValue( "baltek-circle", "font" );
        baltek.style.widths.CIRCLE_BORDER = parseInt(baltek.utils.getStylePropertyValue( "baltek-circle", "border-width" ));

        baltek.style.colors.CIRCLE_BORDER_SELECTED = baltek.utils.getStylePropertyValue( "baltek-circle-selected", "border-color" );

        baltek.style.colors.TEAM_0 = baltek.utils.getStylePropertyValue( "baltek-team-0", "background-color" );
        baltek.style.colors.TEAM_1 = baltek.utils.getStylePropertyValue( "baltek-team-1", "background-color" );

        baltek.style.colors.BALL_BACKGROUND = baltek.utils.getStylePropertyValue( "baltek-ball", "background-color" );
        baltek.style.colors.BALL_BORDER = baltek.utils.getStylePropertyValue( "baltek-ball", "border-color" );

        baltek.style.colors.BALL_BORDER_SELECTED = baltek.utils.getStylePropertyValue( "baltek-ball-selected", "border-color" );
        baltek.style.colors.BALL_BACKGROUND_SELECTED = baltek.utils.getStylePropertyValue( "baltek-ball-selected", "background-color" );

        baltek.style.colors.BOX_TEXT = baltek.utils.getStylePropertyValue( "baltek-box", "color" );
        baltek.style.fonts.BOX_TEXT = baltek.utils.getStylePropertyValue( "baltek-box", "font" );
        baltek.style.widths.BOX_BORDER = parseInt(baltek.utils.getStylePropertyValue( "baltek-box", "border-width" ));

        baltek.style.colors.BOX_BORDER_SELECTED = baltek.utils.getStylePropertyValue( "baltek-box-selected", "border-color" );

        baltek.style.colors.BOX_0 = baltek.utils.getStylePropertyValue( "baltek-box-0", "background-color" );
        baltek.style.colors.BOX_1 = baltek.utils.getStylePropertyValue( "baltek-box-1", "background-color" );

        baltek.style.colors.TEAM_COLORS = [];
        baltek.style.colors.TEAM_COLORS.push(null)
        baltek.style.colors.TEAM_COLORS.push(null)
        baltek.style.colors.TEAM_COLORS[0] = baltek.style.colors.TEAM_0;
        baltek.style.colors.TEAM_COLORS[1] = baltek.style.colors.TEAM_1;
    }
}

///////////////////////////////////////////////////////////////////////////////
