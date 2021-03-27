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
baltek.ai.AI = function(){
    this.__initObject();
};

baltek.ai.AI.__initClassCalled = false;

baltek.ai.AI.__initClass = function(){

    if ( baltek.ai.AI.__initClassCalled ) return;
    baltek.ai.AI.__initClassCalled = true;

    baltek.utils.inherit(baltek.ai.AI, baltek.utils.Observable);

    baltek.ai.AI.prototype.__initObject = function(){
        baltek.ai.AI.super.__initObject.call(this);
        this.confirmAspect = this.newAspect( "confirmAspect" );
        this.squareAspect = this.newAspect( "squareAspect" );
        this.ballAspect = this.newAspect( "ballAspect" );
        this.sprintAspect = this.newAspect( "sprintAspect" );
        this.footballerAspect = this.newAspect( "footballerAspect" );

        this.selectedFootballerSquareIndices = null;
        this.selectedSquareIndices = null;
    };

    baltek.ai.AI.prototype.getFootballerSquareIndices = function(){
        return this.selectedFootballerSquareIndices;
    };

    baltek.ai.AI.prototype.getSquareIndices = function(){
        return this.selectedSquareIndices;
    };

    baltek.ai.AI.prototype.updateFromEngineState = function(state){
        this.randomDecision(state);
    };

    baltek.ai.AI.prototype.randomDecision = function(state){

        this.selectedFootballerSquareIndices = null;
        this.selectedSquareIndices = null;

        var activeTeam = state.teams[state.activeTeamIndex];

        // Without credit the unique decision is to confirm the turn
        if ( activeTeam.credit === 0) {
            baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " confirm turn, because zero credit" );
            this.notifyObservers(this.confirmAspect);
            return;
        }

        // If squares are selectable, then one square must be chosen
        var squareChoices = [];
        var ix = 0;
        var iy = 0;
        var nx = state.field.squaresByIndices.length;
        var ny = state.field.squaresByIndices[0].length;
        var square = null;
        for (ix=0; ix < nx; ix++) {
            for (iy=0; iy < ny; iy++) {
                square = state.field.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    if ( square.selectable ) {
                        squareChoices.push( {ix:ix, iy:iy} );
                    }
                }
            }
        }

        if ( squareChoices.length !== 0 ) {
            // 0 <= baltek.utils.random() < 1
            // 0 <= baltek.utils.random()*squareChoices.length < squareChoices.length
            var squareChoiceIndex = Math.floor( baltek.utils.random()*squareChoices.length );
            this.selectedSquareIndices = squareChoices[squareChoiceIndex];
            baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " destination square" );
            this.notifyObservers(this.squareAspect);
            return;
        }

        // Randomize the decision to kick
        if ( state.ball.selectable && ! state.ball.selected ) {
            if ( baltek.utils.random() <= 0.90 )  {
                baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " select the ball" );
                this.notifyObservers(this.ballAspect);
                return;
            }
        }

        // Randomize the decision to sprint
        if ( activeTeam.sprintCount !== 0 && ! state.sprint && ! state.ball.selected ) {
            if ( baltek.utils.random() <= 0.25 )  {
                baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " sprint" );
                this.notifyObservers(this.sprintAspect);
                return;
            }
        }

        // Randomize the decision to run
        var footballerChoices = [];
        var footballerCount = activeTeam.footballers.length;
        var footballerIndex = 0;
        for (footballerIndex=0; footballerIndex<footballerCount; footballerIndex++) {
            if ( activeTeam.footballers[footballerIndex].selectable ) {
                footballerChoices.push(activeTeam.footballers[footballerIndex].squareIndices);
            }
        }

        if ( footballerChoices.length !== 0 && ! state.ball.selected ) {
            if ( baltek.utils.random() <= 0.99 ) {
                // 0 <= baltek.utils.random() < 1
                // 0 <= baltek.utils.random()*footballerChoices.length < footballerChoices.length
                var footballerChoiceIndex = Math.floor( baltek.utils.random()*footballerChoices.length );
                this.selectedFootballerSquareIndices = footballerChoices[footballerChoiceIndex];
                baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " a footballer" );
                this.notifyObservers(this.footballerAspect);
                return;
            }
        }

        // If no decision yet taken then confirm the turn
        baltek.debug.writeMessage( "AI: team=" + state.activeTeamIndex + " confirm the turn, as the latest choice" );
        this.notifyObservers(this.confirmAspect);
        return;
    };

};
///////////////////////////////////////////////////////////////////////////////
