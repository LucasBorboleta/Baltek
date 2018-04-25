"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL [https://github.com/LucasBorboleta/baltek-the-program](https://github.com/LucasBorboleta/baltek-the-program).

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses](http://www.gnu.org/licenses).
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Field = function(engine){
    this.__initObject(engine);
};

baltek.rules.Field.__initClassCalled = false;

baltek.rules.Field.__initClass = function(){

    if ( baltek.rules.Field.__initClassCalled ) return;
    baltek.rules.Field.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Field, Object);

    baltek.rules.Field.prototype.__initObject = function(engine){
        this.engine = engine;

        // Team square side
        // (The team square is the set of squares that can be occupied by the
        // footballers of a given team at each kickoff)
        this.TSS = 5;

        // Number of square rows
        this.ny = this.TSS ;

        // Number of square rows, including goal squares
        this.nx = 2*( this.TSS + 1 ) ;

        this.firstX = 0;
        this.lastX = this.nx - 1;
        this.middleX = Math.round((this.firstX + this.lastX)/2);

        this.firstY = 0;
        this.lastY = this.ny - 1;
        this.middleY = Math.round((this.firstY + this.lastY)/2);

        this.squaresByIndices = [] ;
        this.goalSquares = [null, null];

        var square = null;
        var ix = 0;
        var iy = 0;

        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            this.squaresByIndices.push([]);

            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                this.squaresByIndices[ix].push(null);

                if ( ix === this.firstX || ix === this.lastX ) {

                    if ( iy === this.middleY ) {
                        square = new baltek.rules.Square(this.engine, ix , iy);
                        square.canHostBall = true;
                        square.canHostFootballer = false;
                        this.squaresByIndices[ix][iy] = square;
                        if ( ix === this.firstX ) {
                            this.goalSquares[0] = square;
                        } else {
                            this.goalSquares[1] = square;
                        }
                    }

                } else {
                    square = new baltek.rules.Square(this.engine, ix , iy);
                    square.canHostBall = true;
                    square.canHostFootballer = true;
                    this.squaresByIndices[ix][iy] = square;
                }
            }
        }

        this.engine.teams[0].goalSquare = this.goalSquares[0] ;
        this.engine.teams[1].goalSquare = this.goalSquares[1] ;
    };

    baltek.rules.Field.prototype.empty = function(){
        // Clear all squares of ball and footballers
        var square = null;
        var ix = 0;
        var iy = 0;
        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                square = this.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.empty();
                }
            }
        }
    };

    baltek.rules.Field.prototype.enableSelection = function(condition){
        var square = null;
        var ix = 0;
        var iy = 0;
        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                square = this.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.enableSelection(condition);
                }
            }
        }
    };

    baltek.rules.Field.prototype.exportMoveState = function(){
        var state = {};
        state.squaresByIndices = [];

        var ix = 0;
        var iy = 0;
        var square = null;
        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            state.squaresByIndices.push([]);

            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                this.squaresByIndices[ix].push(null);

                square = this.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    state.squaresByIndices[ix][iy] = square.exportMoveState();
                }
            }
        }

        return state;
    };

    baltek.rules.Field.prototype.kickoff = function(){

        // Empty all squares from ball and footballers
        this.empty();

        // Assign squares to the ball and the active footballers
        var activeIndex = this.engine.activeTeam.teamIndex;
        var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
        var activeDirectionX = 1 - 2*activeIndex;

        this.squaresByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setBall(this.engine.ball);

        this.squaresByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer3);
        this.squaresByIndices[activeOriginX + this.TSS*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer2t);
        this.squaresByIndices[activeOriginX + this.TSS*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer2b);
        this.squaresByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer1t);
        this.squaresByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer1m);
        this.squaresByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer1b);

        // Assign squares to the passive footballers
        var passiveIndex = this.engine.passiveTeam.teamIndex;
        var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
        var passiveDirectionX = 1 - 2*passiveIndex;

        this.squaresByIndices[passiveOriginX + (this.TSS - 1)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer3);
        this.squaresByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer2t);
        this.squaresByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer2b);
        this.squaresByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer1t);
        this.squaresByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer1m);
        this.squaresByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer1b);
    };

    baltek.rules.Field.prototype.select = function(condition){
        var square = null;
        var ix = 0;
        var iy = 0;
        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                square = this.squaresByIndices[ix][iy];
                if ( square !== null ) {
                    square.select(condition);
                }
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
