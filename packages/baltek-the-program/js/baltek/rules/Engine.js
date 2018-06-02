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
baltek.rules.Engine = function(){
    this.__initObject();
};

baltek.rules.Engine.__initClassCalled = false;

baltek.rules.Engine.__initClass = function(){

    if ( baltek.rules.Engine.__initClassCalled ) return;
    baltek.rules.Engine.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Engine, baltek.utils.Observable);

    baltek.rules.Engine.prototype.__initObject = function(){
        baltek.rules.Engine.super.__initObject.call(this);
        this.gameStateAspect = this.newAspect( "gameStateAspect" );

        this.SCORE_MAX = 2;
        this.CREDIT_MAX = 3;
        this.BONUS_MAX = 1; // Sprint bonus

        this.teams = [];
        this.teams[0] = new baltek.rules.Team(0);
        this.teams[1] = new baltek.rules.Team(1);

        this.activeTeam = this.teams[0];
        this.passiveTeam = this.teams[1];

        this.ball = new baltek.rules.Ball();

        this.field = new baltek.rules.Field(this);
    };

    baltek.rules.Engine.prototype.exportMoveState = function(){
        var state = {};
        state.activeTeamIndex = this.activeTeam.teamIndex;
        state.sprint = this.move.sprint;
        state.ball = this.ball.exportMoveState();
        state.teams = [];
        state.teams[0] = this.teams[0].exportMoveState();
        state.teams[1] = this.teams[1].exportMoveState();
        state.field = this.field.exportMoveState();
        return state;
    };

    baltek.rules.Engine.prototype.getBonusMax = function(){
        return this.BONUS_MAX;
    };

    baltek.rules.Engine.prototype.getCreditMax = function(){
        return this.CREDIT_MAX;
    };

    baltek.rules.Engine.prototype.getFieldNx = function(){
        return this.field.nx;
    };

    baltek.rules.Engine.prototype.getFieldNy = function(){
        return this.field.ny;
    };

    baltek.rules.Engine.prototype.getFooballerCount = function(teamIndex){
        return this.teams[teamIndex].footballers.length;
    };

    baltek.rules.Engine.prototype.getFooballerForce = function(teamIndex, footballerIndex){
        return this.teams[teamIndex].footballers[footballerIndex].force;
    };

    baltek.rules.Engine.prototype.getScoreMax = function(){
        return this.SCORE_MAX;
    };

    baltek.rules.Engine.prototype.getTurnState = function(){
        var state = {};
        state.activeTeam = this.activeTeam;
        state.ball = this.ball.getTurnState();
        state.teams = [];
        state.teams[0] = this.teams[0].getTurnState();
        state.teams[1] = this.teams[1].getTurnState();
        return state;
    };

    baltek.rules.Engine.prototype.hasFieldSquare = function(ix, iy){
        return ( this.field.squaresByIndices[ix][iy] !== null );
    };

    baltek.rules.Engine.prototype.hasGoalSquare = function(ix, iy){
            var square = this.field.squaresByIndices[ix][iy];
            return ( square !== null && ( square === this.activeTeam.goalSquare || square === this.passiveTeam.goalSquare ) );
        };

    baltek.rules.Engine.prototype.registerObserver = function(observer){
        baltek.rules.Engine.super.registerObserver.call(this, observer, this.gameStateAspect);
    };

    baltek.rules.Engine.prototype.setActiveTeam = function(activeTeam){
        if ( activeTeam !== this.activeTeam ) {
            this.switchActiveAndPassiveTeams();
        }
    };

    baltek.rules.Engine.prototype.setPassiveTeam = function(passiveTeam){
        if ( passiveTeam !== this.passiveTeam ) {
            this.switchActiveAndPassiveTeams();
        }
    };

    baltek.rules.Engine.prototype.setTurnState = function(state){
        this.field.empty();
        this.setActiveTeam(state.activeTeam);
        this.ball.setTurnState(state.ball);
        this.teams[0].setTurnState(state.teams[0]);
        this.teams[1].setTurnState(state.teams[1]);
    };

    baltek.rules.Engine.prototype.switchActiveAndPassiveTeams = function(){
        var oldActiveTeam = this.activeTeam;
        var oldPassiveTeam = this.passiveTeam;
        this.activeTeam = oldPassiveTeam;
        this.passiveTeam = oldActiveTeam;
    };

    ////////// Match methods  //////////

    baltek.rules.Engine.prototype.matchInit = function(){
        //baltek.debug.writeMessage("matchInit: enter");
        this.match = {};

        this.match.isActive = true;

        this.activeTeam = this.teams[0];
        this.passiveTeam = this.teams[1];

        this.activeTeam.score = 0;
        this.passiveTeam.score = 0;

        this.roundInit();
    };

    baltek.rules.Engine.prototype.matchIsActive = function(){
        return this.match.isActive;
    };

    baltek.rules.Engine.prototype.matchIsDefined = function(){
        return this.match !== undefined;
    };

    baltek.rules.Engine.prototype.matchUpdate = function(){
        //baltek.debug.writeMessage("matchUpdate: enter");
        if ( this.match.isActive ) {
            this.roundUpdate();

            if ( ! this.round.isActive ) {

                if ( this.activeTeam.haveGoaled ) {
                    this.activeTeam.score += 1;

                    if ( this.activeTeam.score >= this.SCORE_MAX || this.passiveTeam.score >= this.SCORE_MAX ) {
                        this.match.isActive = false;
                    }
                }

                if ( this.match.isActive ) {
                    this.switchActiveAndPassiveTeams();
                    this.roundInit();
                    this.roundUpdate();
                } else {
                    //baltek.debug.writeMessage("matchUpdate: this.match.isActive=" + this.match.isActive);
                    this.field.enableSelection(false);
                    this.activeTeam.enableSelection(false);
                    this.activeTeam.select(false);
                    this.ball.select(false);
                    this.ball.enableSelection(false);
                }
            }
        }

        this.notifyObservers(this.gameStateAspect);
    };

    ////////// Round methods  //////////

    baltek.rules.Engine.prototype.roundInit = function(){
        //baltek.debug.writeMessage("roundInit: enter");
        this.round = {};

        this.round.isActive = true;

        this.activeTeam.canSprint = true;
        this.passiveTeam.canSprint = true;

        this.activeTeam.haveGoaled = false;
        this.passiveTeam.haveGoaled = false;

        this.field.kickoff();
        this.turnInit();
    };

    baltek.rules.Engine.prototype.roundUpdate = function(){
        //baltek.debug.writeMessage("roundUpdate: enter");
        if ( this.round.isActive ) {

            this.turnUpdate();

            if ( ! this.turn.isActive ) {

                if ( this.activeTeam.haveGoaled ) {
                    this.round.isActive = false;
                }

                if ( this.round.isActive ) {
                    this.switchActiveAndPassiveTeams();
                    this.turnInit();
                    this.turnUpdate();
                }
            }
        }
    };

    ////////// Turn methods  //////////

    baltek.rules.Engine.prototype.turnCancel = function(){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("turnCancel:");
        baltek.utils.assert( this.move.isActive );
        this.setTurnState(this.turn.state);
        this.turnInit();
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.turnConfirm = function(){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("turnConfirm:");
        baltek.utils.assert( this.move.isActive );
        this.turn.isActive = false;
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.turnInit = function(){
        //baltek.debug.writeMessage("turnInit: enter");
        this.turn = {};

        this.turn.state = this.getTurnState();

        this.turn.isActive = true;

        this.activeTeam.credit = this.CREDIT_MAX;
        this.passiveTeam.credit = 0;

        this.activeTeam.enableSelection(false);
        this.passiveTeam.enableSelection(false);

        this.activeTeam.enableCapabilities(true);
        this.passiveTeam.enableCapabilities(false);

        this.activeTeam.select(false);
        this.passiveTeam.select(false);

        this.field.enableSelection(false);
        this.field.enableSelection(false);

        this.ball.enableSelection(false);
        this.ball.select(false);

        this.moveInit();
    };

    baltek.rules.Engine.prototype.turnUpdate = function(){
        //baltek.debug.writeMessage("turnUpdate: enter");
        if ( this.turn.isActive ) {

            this.moveUpdate();

            if ( ! this.move.isActive ) {
                if ( this.turn.isActive ) {
                    this.moveInit();
                    this.moveUpdate();
                }
            }
        }
    };

    ////////// Move methods  //////////

    baltek.rules.Engine.prototype.moveFindDestinations = function(){
        //baltek.debug.writeMessage("moveFindDestinations: enter");

        if ( ! this.move.isActive ) return;
        if ( this.move.sourceSquare === null ) return;
        if ( this.move.destinationSquare !== null ) return;

        this.field.enableSelection(false);
        this.activeTeam.enableSelection(false);

        // Let actual source selectable in order to allowing unselect it
        if ( this.ball.isSelected() ) {
            this.ball.enableSelection(true);
        } else {
            this.ball.enableSelection(false);
            this.move.sourceSquare.getActiveFootballer().enableSelection(true);
        }

        var activeFootballer = this.move.sourceSquare.footballers[this.activeTeam.teamIndex];

        var ux=0;
        var uy=0;
        var d=0;
        var dx=0;
        var dy=0;
        var ix=0;
        var iy=0;
        var square=null;

        if ( this.ball.isSelected() ) {
            // The ball moves along a vector of size this.move.LEN_KICK or less

            for ( ux=-1; ux<=1; ux++ ) {
                for ( uy=-1; uy<=1; uy++ ) {
                    for ( d=1; d <= this.move.LEN_KICK; d++) {
                        dx = d*ux;
                        dy = d*uy;
                        ix = this.move.sourceSquare.ix + dx;
                        iy = this.move.sourceSquare.iy + dy;
                        if ( ix >= this.field.firstX && ix <= this.field.lastX && iy >= this.field.firstY && iy <= this.field.lastY ) {
                            square = this.field.squaresByIndices[ix][iy];
                            if ( square !== null && square != this.move.sourceSquare && square.canHostBall && square !== this.activeTeam.goalSquare ) {
                                if ( d <= 1) {
                                    square.setCost(1);
                                    square.enableSelection( this.activeTeam.credit >= this.move.sourceCost + square.getCost() );
                                } else {
                                    // Search along the trajectory
                                    // the passiveFootballer, if any,
                                    // with the strongest force
                                    var strongestPassiveFootballer = null;
                                    var t;
                                    var tx;
                                    var ty;
                                    var jx;
                                    var jy;
                                    var tsquare;
                                    for ( t=1; t < d; t++ ) {
                                        tx = t*ux;
                                        ty = t*uy;
                                        jx = this.move.sourceSquare.ix + tx;
                                        jy = this.move.sourceSquare.iy + ty;
                                        tsquare = this.field.squaresByIndices[jx][jy];
                                        if ( tsquare !== null && tsquare.hasPassiveFootballer() ) {
                                            if ( strongestPassiveFootballer === null ) {
                                                strongestPassiveFootballer = tsquare.getPassiveFootballer();
                                            } else if ( tsquare.getPassiveFootballer().force > strongestPassiveFootballer ) {
                                                strongestPassiveFootballer = tsquare.getPassiveFootballer();
                                            }
                                        }
                                    }

                                    if ( strongestPassiveFootballer === null ) {
                                        square.setCost(1);
                                        square.enableSelection( this.activeTeam.credit >= this.move.sourceCost + square.getCost() );

                                    } else if ( activeFootballer.force >= strongestPassiveFootballer.force ) {
                                        square.setCost(1);
                                        square.enableSelection( this.activeTeam.credit >= this.move.sourceCost + square.getCost() );

                                    } else {
                                        square.setCost(1 + strongestPassiveFootballer.force - activeFootballer.force);
                                        square.enableSelection( this.activeTeam.credit >= this.move.sourceCost + square.getCost() );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            var runLength = 0;
            if ( this.move.sprint ) {
                runLength = this.move.LEN_SPRINT;
            }  else {
                runLength = this.move.LEN_RUN;
            }

            // The footballer moves freely inside a square of size runLength or less
            for ( ix=this.move.sourceSquare.ix - runLength; ix <= this.move.sourceSquare.ix + runLength; ix++ ) {
                if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                    for ( iy=this.move.sourceSquare.iy - runLength; iy <= this.move.sourceSquare.iy + runLength; iy++ ) {
                        if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                            square = this.field.squaresByIndices[ix][iy];
                            if ( square !== null && square != this.move.sourceSquare ) {
                                if ( square.canHostFootballer && ! square.hasActiveFootballer() ) {
                                    square.setCost(1);
                                    square.enableSelection( this.activeTeam.credit >= this.move.sourceCost + square.getCost() );
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    baltek.rules.Engine.prototype.moveFindSources = function(){
        //baltek.debug.writeMessage("moveFindSources: enter");

        if ( this.move.isActive && this.move.sourceSquare === null ) {
            this.field.enableSelection(false);
            this.activeTeam.enableSelection(false);
            this.activeTeam.select(false);
            this.ball.select(false);
            this.ball.enableSelection(false);

            var activeFootballer = null;
            var passiveFootballer = null;
            var n = this.activeTeam.footballers.length;
            var i;

            this.ball.setCost(0);

            for ( i=0; i<n; i++ ) {
                activeFootballer = this.activeTeam.footballers[i];

                if ( activeFootballer.canRun ) {
                    // The activeFootballer has not run during this turn
                    activeFootballer.setCost(0);
                    activeFootballer.enableSelection( this.activeTeam.credit >= activeFootballer.getCost() );
                }

                if ( activeFootballer.canKick && activeFootballer.square.hasBall() ) {
                    // The activeFootballer has not kick during this turn
                    passiveFootballer = activeFootballer.square.getPassiveFootballer();

                    if ( passiveFootballer === null ) {
                        this.ball.setCost(0);
                        this.ball.enableSelection( this.activeTeam.credit >= this.ball.getCost() );

                    } else if ( activeFootballer.force >= passiveFootballer.force ) {
                        this.ball.setCost(0);
                        this.ball.enableSelection( this.activeTeam.credit >= this.ball.getCost() );

                    } else {
                        this.ball.setCost(passiveFootballer.force - activeFootballer.force);
                        this.ball.enableSelection( this.activeTeam.credit >= this.ball.getCost() );
                    }
                }
            }
        }
    };

    baltek.rules.Engine.prototype.moveInit = function(){
        //baltek.debug.writeMessage("moveInit: enter");
        this.move = {};

        this.move.isActive = true;

        this.move.LEN_KICK = 2;
        this.move.LEN_RUN = 1;
        this.move.LEN_SPRINT = 2;

        this.move.sprint = false;
        this.move.sourceSquare = null;
        this.move.sourceCost = 0;
        this.move.destinationSquare = null;
        this.move.destinationCost = 0;
    };

    baltek.rules.Engine.prototype.moveSelectBall = function(condition){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("moveSelectBall: condition=" + condition);

        baltek.utils.assert( this.move.isActive );

        if ( condition ) {
            baltek.utils.assert( this.move.sourceSquare === null );
            baltek.utils.assert( this.ball.isSelectable() );
            this.move.sourceSquare = this.ball.square;
            this.move.sourceCost = this.ball.getCost();
            this.ball.select(true);

        } else {
            baltek.utils.assert( this.move.sourceSquare !== null );
            baltek.utils.assert( this.move.sourceSquare === this.ball.square );
            baltek.utils.assert( this.ball.isSelected() );
            this.move.sourceSquare = null;
            this.move.sourceCost = 0;
            this.ball.select(false);
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSelectFootballer = function(squareIndices, condition){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("moveSelectFootballer: condition=" + condition);

        baltek.utils.assert( this.move.isActive );

        var square = this.field.squaresByIndices[squareIndices.ix][squareIndices.iy];
        baltek.utils.assert( square !== null );

        var activeFootballer = square.getActiveFootballer();
        baltek.utils.assert( activeFootballer !== null );

        if ( condition ) {
            baltek.utils.assert( this.move.sourceSquare === null );
            baltek.utils.assert( activeFootballer.isSelectable() );
            this.move.sourceSquare = square;
            this.move.sourceCost = activeFootballer.getCost();
            activeFootballer.select(true);

        } else {
            baltek.utils.assert( this.move.sourceSquare !== null );
            baltek.utils.assert( this.move.sourceSquare === square );
            baltek.utils.assert( activeFootballer.isSelected() );
            this.move.sourceSquare = null;
            this.move.sourceCost = 0;
            activeFootballer.select(false);
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSelectSquare = function(squareIndices){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("moveSelectSquare:");

        baltek.utils.assert( this.move.isActive );
        baltek.utils.assert( this.move.sourceSquare !== null );
        baltek.utils.assert( this.move.destinationSquare === null );

        var square = this.field.squaresByIndices[squareIndices.ix][squareIndices.iy];
        baltek.utils.assert( square !== null );
        baltek.utils.assert( square.isSelectable() );

        this.move.destinationSquare = square;
        this.move.destinationCost = square.getCost();
        square.select(true);

        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSprint = function(condition){
        // Triggered by the player of the activeTeam
        //baltek.debug.writeMessage("moveSprint:");

        baltek.utils.assert( this.move.isActive );
        if ( condition ) {
            baltek.utils.assert( this.activeTeam.canSprint );
            this.move.sprint = true;
        } else {
            this.move.sprint = false;
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveUpdate = function(){
        //baltek.debug.writeMessage("moveUpdate: enter");
        if ( this.move.isActive ) {

            if ( this.move.sourceSquare === null ) {
                this.moveFindSources();

            } else if ( this.move.destinationSquare === null ) {
                this.moveFindDestinations();

            } else {
                this.move.isActive = false;

                if ( this.ball.isSelected() ) {
                    this.move.sourceSquare.getActiveFootballer().canKick = false;
                    this.move.destinationSquare.setBall(this.ball);

                    if (this.move.destinationSquare === this.passiveTeam.goalSquare ) {
                        this.activeTeam.haveGoaled = true;
                    }

                } else {
                    this.move.sourceSquare.getActiveFootballer().canRun = false;
                    this.move.destinationSquare.setActiveFootballer(this.move.sourceSquare.getActiveFootballer());

                    if ( this.move.sprint ) {
                        this.activeTeam.canSprint = false;
                    }
                }

                this.activeTeam.credit -= ( this.move.sourceCost + this.move.destinationCost );
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
