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
baltek.rules.Square = function(engine, ix, iy){
    this.__initObject(engine, ix, iy);
};

baltek.rules.Square.__initClassCalled = false;

baltek.rules.Square.__initClass = function(){

    if ( baltek.rules.Square.__initClassCalled ) return;
    baltek.rules.Square.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Square, baltek.rules.Selectable);

    baltek.rules.Square.prototype.__initObject = function(engine, ix, iy){
        baltek.rules.Square.super.__initObject.call(this);
        this.engine = engine;
        this.ix = ix ;
        this.iy = iy ;
        this.canHostBall = false;
        this.canHostFootballer = false;
        this.ball = null ;
        this.footballers = [null, null] ;
    };

    baltek.rules.Square.prototype.empty = function(){
        if ( this.ball !== null ) {
            this.ball.square = null;
            this.ball = null;
        }

        if ( this.footballers[0] !== null ) {
            this.footballers[0].square = null;
            this.footballers[0] = null;
        }

        if ( this.footballers[1] !== null ) {
            this.footballers[1].square = null;
            this.footballers[1] = null;
        }
    };

    baltek.rules.Square.prototype.exportMoveState = function(){
        var state = baltek.rules.Square.super.exportMoveState.call(this);
        return state;
    };

    baltek.rules.Square.prototype.getActiveFootballer = function(){
        return this.footballers[this.engine.activeTeam.teamIndex];
    };

    baltek.rules.Square.prototype.getBall = function(){
        return this.ball;
    };

    baltek.rules.Square.prototype.getPassiveFootballer = function(){
        return this.footballers[this.engine.passiveTeam.teamIndex];
    };

    baltek.rules.Square.prototype.getSquareIndices = function(){
        return { ix:this.ix, iy:this.iy };
    };

    baltek.rules.Square.prototype.hasActiveFootballer = function(){
        return ( this.footballers[this.engine.activeTeam.teamIndex] !== null );
    };

    baltek.rules.Square.prototype.hasBall = function(){
        return ( this.ball !== null );
    };

    baltek.rules.Square.prototype.hasPassiveFootballer = function(){
        return ( this.footballers[this.engine.passiveTeam.teamIndex] !== null );
    };

    baltek.rules.Square.prototype.setActiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null ),
        baltek.utils.assert( footballer.team.teamIndex === this.engine.activeTeam.teamIndex );
        this.setFootballer(footballer);
    };

    baltek.rules.Square.prototype.setBall = function(ball){
        baltek.utils.assert( this.canHostBall );
        baltek.utils.assert( ball !== null );

        if ( this.ball !== ball ) {
            baltek.utils.assert( this.ball === null );

            if ( ball.square !== null ) {
                ball.square.ball = null;
            }
            this.ball = ball;
            ball.square = this;
        }
    };

    baltek.rules.Square.prototype.setFootballer = function(footballer){
        baltek.utils.assert( this.canHostFootballer );
        baltek.utils.assert( footballer !== null );

        if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
            baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null );

            if ( footballer.square !== null ) {
                footballer.square.footballers[footballer.team.teamIndex] = null;
            }
            this.footballers[footballer.team.teamIndex] = footballer;
            footballer.square = this;
        }
    };

    baltek.rules.Square.prototype.setPassiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null );
        baltek.utils.assert( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex );
        this.setFootballer(footballer);
    };
};
///////////////////////////////////////////////////////////////////////////////
