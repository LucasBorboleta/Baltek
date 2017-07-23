"use strict";
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
        this.engineAspect = this.newAspect("engineAspect");

        this.SCORE_MAX = 2;
        this.CREDIT_MAX = 3;

        this.teams = [];
        this.teams.push(null);
        this.teams.push(null);

        this.teams[0] = new baltek.rules.Team(0);
        this.teams[1] = new baltek.rules.Team(1);

        this.activeTeam = this.teams[0];
        this.passiveTeam = this.teams[1];

        this.ball = new baltek.rules.Ball();

        this.field = new baltek.rules.Field(this);
        this.field.initBallAndFootballerBoxes();
    }

    baltek.rules.Engine.prototype.exportState = function(){
        var state = {};
        state.activeTeamIndex = this.activeTeam.teamIndex;
        state.ball = this.ball.exportState();
        state.teams = [];
        state.teams[0] = this.teams[0].exportState();
        state.teams[1] = this.teams[1].exportState();
        state.field = this.field.exportState();
        return state;
    }

    baltek.rules.Engine.prototype.getState = function(){
        var state = {};
        state.activeTeam = this.activeTeam;
        state.ball = this.ball.getState();
        state.teams = [];
        state.teams[0] = this.teams[0].getState();
        state.teams[1] = this.teams[1].getState();
        return state;
    }

    baltek.rules.Engine.prototype.getCreditMax = function(){
        return this.CREDIT_MAX;
    }

    baltek.rules.Engine.prototype.getFieldNx = function(){
        return this.field.nx;
    }

    baltek.rules.Engine.prototype.getFieldNy = function(){
        return this.field.ny;
    }

    baltek.rules.Engine.prototype.getFooballerCount = function(teamIndex){
        return this.teams[teamIndex].footballers.length;
    }

    baltek.rules.Engine.prototype.getFooballerForce = function(teamIndex, footballerIndex){
        return this.teams[teamIndex].footballers[footballerIndex].force;
    }

    baltek.rules.Engine.prototype.getScoreMax = function(){
        return this.SCORE_MAX;
    }

    baltek.rules.Engine.prototype.hasFieldBox = function(ix, iy){
        return ( this.field.boxesByIndices[ix][iy] !== null );
    }

    baltek.rules.Engine.prototype.setActiveTeam = function(activeTeam){
        if ( activeTeam !== this.activeTeam ) {
            this.switchActiveAndPassiveTeams();
        }
    }

    baltek.rules.Engine.prototype.setPassiveTeam = function(passiveTeam){
        if ( passiveTeam !== this.passiveTeam ) {
            this.switchActiveAndPassiveTeams();
        }
    }

    baltek.rules.Engine.prototype.setState = function(state){
        this.field.clearBallAndFootballerBoxes();
        this.setActiveTeam(state.activeTeam);
        this.ball.setState(state.ball);
        this.teams[0].setState(state.teams[0]);
        this.teams[1].setState(state.teams[1]);
    }

    baltek.rules.Engine.prototype.switchActiveAndPassiveTeams = function(){
        var oldActiveTeam = this.activeTeam;
        var oldPassiveTeam = this.passiveTeam;
        this.activeTeam = this.oldPassiveTeam;
        this.passiveTeam = this.oldActiveTeam;
    }

    baltek.rules.Engine.prototype.matchInit = function(){
        this.match = {};

        this.match.isActive = true;

        this.activeTeam = this.teams[0];
        this.passiveTeam = this.teams[1];

        this.activeTeam.score = 0;
        this.passiveTeam.score = 0;

        this.roundInit();
        this.notifyObservers();
    }

    baltek.rules.Engine.prototype.roundInit = function(){
        this.round = {};

        this.round.isActive = true;

        this.activeTeam.canSprint = true;
        this.passiveTeam.canSprint = true;

        this.activeTeam.haveGoaled = false;
        this.passiveTeam.haveGoaled = false;

        this.field.initBallAndFootballerBoxes();
        this.turnInit();
    }

    baltek.rules.Engine.prototype.turnInit = function(){
        this.turn = {};

        this.turn.isActive = true;

        this.activeTeam.credit = this.CREDIT_MAX;
        this.passiveTeam.credit = 0;

        this.activeTeam.enableFootballers(false);
        this.passiveTeam.enableFootballers(false);

        this.activeTeam.initFootballerCapabilities(true);
        this.passiveTeam.initFootballerCapabilities(false);

        this.activeTeam.selectFootballers(false);
        this.passiveTeam.selectFootballers(false);

        this.field.enableBoxes(false);
        this.field.selectBoxes(false);

        this.ball.selectable = false;
        this.ball.selected = false;

        this.moveInit();
    }

    baltek.rules.Engine.prototype.moveInit = function(){
        this.move = {};

        this.move.isActive = true;

        this.move.KIND_RUN = 900;
        this.move.KIND_SPRINT = 901;
        this.move.KIND_KICK = 902;

        this.move.LEN_KICK = 2;
        this.move.LEN_RUN = 1;
        this.move.LEN_SPRINT = 2;

        this.move.kind = null;
        this.move.sourceBox = null;
        this.move.sourceCost = 0;
        this.move.destinationBox = null;
        this.move.destinationCost = 0;
    }

    baltek.rules.Engine.prototype.matchUpdate = function(){
        if ( this.match.isActive ) {
            this.roundUpdate();

            if ( ! this.round.isActive ) {

                if ( this.activeTeam.haveGoaled ) {
                    this.activeTeam.score += 1

                    if ( this.activeTeam.score >= this.SCORE_MAX || this.passiveTeam.score >= this.SCORE_MAX ) {
                        this.match.isActive = false;
                    }
                }

                if ( this.match.isActive ) {
                    this.switchActiveAndPassiveTeams();
                    this.roundInit();
                }
            }
            this.notifyObservers();
        }
    }

    baltek.rules.Engine.prototype.roundUpdate = function(){
        if ( this.round.isActive ) {

            this.turnUpdate();

            if ( ! this.turn.isActive ) {

                if ( this.activeTeam.haveGoaled ) {
                    this.round.isActive = false;
                }

                if ( this.round.isActive ) {
                    this.switchActiveAndPassiveTeams();
                    this.turnInit();
                }
            }
        }
    }

    baltek.rules.Engine.prototype.turnUpdate = function(){
        if ( this.turn.isActive ) {

            this.moveUpdate();

            if ( ! this.move.isActive ) {

                if ( this.activeTeam.credit <= 0 ) {
                    this.turn.isActive = false;
                }

                if ( this.activeTeam.haveGoaled ) {
                    this.turn.isActive = false;
                }

                if ( this.turn.isActive ) {
                    this.moveInit();
                }
            }
        }
    }

    baltek.rules.Engine.prototype.turnConfirm = function(){
        // Triggered by the player of the activeTeam

        if ( this.turn.isActive ) {
            this.turn.isActive = false;
            this.matchUpdate();
        }
    }

    baltek.rules.Engine.prototype.moveUpdate = function(){
        if ( this.move.isActive ) {

            if ( this.move.sourceBox === null ) {
                this.moveFindSources();

            } else if ( this.move.destinationBox === null ) {
                this.moveFindDestinations();

            } else {
                this.move.isActive = false;

                if ( this.move.kind == this.move.KIND_RUN || this.move.kind == this.move.KIND_SPRINT ) {
                    this.move.sourceBox.getActiveFootballer().canRun = false;
                    this.move.destinationBox.setActiveFootballer(this.move.sourceBox.getActiveFootballer());

                } else if ( this.move.kind == this.move.KIND_KICK ) {
                    this.move.sourceBox.getActiveFootballer().canKick = false;
                    this.move.destinationBox.setBall(this.move.sourceBox.getBall());
                }

                this.activeTeam.credit -= ( this.move.sourceCost + this.move.destinationCost );

                if ( this.move.kind == this.move.KIND_SPRINT ) {
                    this.activeTeam.canSprint = false;
                }

                if (this.move.destinationBox === this.passiveTeam.goalBox ) {
                    this.activeTeam.haveGoaled = true;
                }
            }
        }
    }

    baltek.rules.Engine.prototype.moveSelectBall = function(condition){
        // Triggered by the player of the activeTeam

        baltek.utils.assert( this.move.isActive );

        if ( condition ) {
            baltek.utils.assert( this.move.sourceBox === null );
            baltek.utils.assert( this.ball.selectable );
            this.move.kind = this.move.KIND_KICK;
            this.move.sourceBox = this.ball.box;
            this.ball.selected = true;
            this.matchUpdate();

        } else {
            baltek.utils.assert( this.move.sourceBox !== null );
            baltek.utils.assert( this.ball.selected );
            this.move.kind = null;
            this.move.sourceBox = null;
            this.ball.selected = false;
            this.matchUpdate();
        }
    }

    baltek.rules.Engine.prototype.moveSelectDestination = function(destinationWithCost){
        // Triggered by the player of the activeTeam

        if ( this.move.isActive && this.move.sourceBox !== null && this.move.kind !== null ) {
            if ( this.move.destinationBox === null) {
                if ( Baltek.Utils.hasValue(this.move.destinationsWithCosts, destinationWithCost) ) {
                    this.move.destinationBox = destinationWithCost.box;
                    this.move.destinationCost = destinationWithCost.cost;
                    this.matchUpdate();
                }
            }
        }
    }

    baltek.rules.Engine.prototype.moveFindSources = function(){
        baltek.debug.writeMessage("moveFindSources: enter");

        if ( this.move.isActive && this.move.sourceBox === null ) {
            var activeFootballer = null;
            var passiveFootballer = null;
            var cost = 0;
            var n = this.activeTeam.footballers.length;
            var i;

            this.ball.cost = 0;
            this.ball.selectable = false;

            for ( i=0; i<n; i++ ) {
                activeFootballer = this.activeTeam.footballers[i];

                if ( activeFootballer.canRun ) {
                    // The activeFootballer has not run during this turn
                    activeFootballer.cost = 0;
                    activeFootballer.selectable = true;
                }

                if ( activeFootballer.canKick && activeFootballer.box.hasBall() ) {
                    // The activeFootballer has not kick during this turn
                    passiveFootballer = activeFootballer.box.getPassiveFootballer();

                    if ( passiveFootballer === null ) {
                        this.ball.cost = 0;
                        this.ball.selectable = true;

                    } else if ( activeFootballer.force >= passiveFootballer.force ) {
                        this.ball.cost = 0;
                        this.ball.selectable = true;

                    } else {
                        this.ball.cost = passiveFootballer.force - activeFootballer.force;
                        if ( this.activeTeam.credit >= this.ball.cost ) {
                            this.ball.selectable = true;
                        } else {
                            this.ball.selectable = false;
                        }
                    }
                }
            }
        }

        baltek.debug.writeMessage("moveFindSources: exit");
    }

    baltek.rules.Engine.prototype.moveFindDestinations = function(){
        baltek.debug.writeMessage("moveFindDestinations: enter");

        var destinationsWithCosts = [] ;

        var preconditions = (   this.move.isActive &&
                                this.move.sourceBox !== null &&
                                this.move.destinationBox === null );

        if ( ! preconditions ) {
            return destinationsWithCosts;
        }

        var activeFootballer = this.sourceBox.footballers[this.engine.activeTeam.teamIndex];

        if ( this.move.kind === this.move.KIND_KICK ) {
            // The ball moves along a vector of size this.move.LEN_KICK or less
            var ux;
            var uy;
            var d;
            var dx;
            var dy;
            var ix;
            var iy;
            var box;
            for ( ux=-1; ux<=1; ux++ ) {
                for ( uy=-1; uy<=1; uy++ ) {
                    for ( d=1; d <= this.move.LEN_KICK; d++) {
                        dx = d*ux;
                        dy = d*uy;
                        ix = this.move.sourceBox.ix + dx;
                        iy = this.move.sourceBox.iy + dy;
                        if ( ix >= this.field.firstX && ix <= this.field.lastX && iy >= this.field.firstY && iy <= this.field.lastY ) {
                             box = this.field.boxes[ix][iy];
                             if ( box !== null && box != this.source && box.canHostBall && box !== this.activeTeam.goalBox ) {
                                 if ( d <= 1) {
                                     destinationsWithCosts.push( {box: box, cost: 1} );
                                 } else {
                                     // Find the passiveFootballer with the strongest force
                                     // on the trajectory
                                     var strongestPassiveFootballer = null;
                                     var t;
                                     var tx;
                                     var ty;
                                     var jx;
                                     var jy;
                                     var tbox;
                                     for ( t=1; t < d; t++ ) {
                                         tx = t*ux;
                                         ty = t*uy;
                                         jx = this.move.sourceBox.ix + tx;
                                         jy = this.move.sourceBox.iy + ty;
                                         tbox = this.field.boxes[jx][jy];
                                         if ( tbox !== null && tbox.hasPassiveFootballer() ) {
                                             if ( strongestPassiveFootballer === null ) {
                                                 strongestPassiveFootballer = tbox.getPassiveFootballer();
                                             } else if ( tbox.getPassiveFootballer().force > strongestPassiveFootballer ) {
                                                 strongestPassiveFootballer = tbox.getPassiveFootballer();
                                             }
                                         }
                                     }

                                     if ( strongestPassiveFootballer === null ) {
                                         destinationsWithCosts.push( {box: box, cost: 1} );

                                     } else if ( activeFootballer.force >= strongestPassiveFootballer.force ) {
                                         destinationsWithCosts.push( {box: box, cost: 1} );

                                     } else {
                                         var cost = strongestPassiveFootballer.force - activeFootballer.force;
                                         if ( this.activeTeam.credit >= this.move.sourceCost + cost ) {
                                             destinationsWithCosts.push( {box: box, cost: kickCost} );
                                         }
                                     }
                                 }
                             }
                        }
                    }
                }
            }
        } else if ( this.move.kind === this.move.KIND_RUN ) {
            // The footballer moves freely inside a square of size this.move.LEN_RUN or less
            var ix;
            var iy;
            var box;
            for ( ix=this.move.sourceBox.ix - this.move.LEN_RUN; ix <= this.move.sourceBox.ix + this.move.LEN_RUN; ix++ ) {
                if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                    for ( iy=this.move.sourceBox.iy - this.move.LEN_RUN; iy <= this.move.sourceBox.iy + this.move.LEN_RUN; iy++ ) {
                        if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                            box = this.field.boxes[ix][iy];
                            if ( box !== null && box != this.sourceBox ) {
                                if ( box.canHostFootballer && ! box.hasActiveFootballer() ) {
                                    destinationsWithCosts.push( {box: box, cost: 1} );
                                }
                            }
                        }
                    }
                }
            }
        } else if ( this.move.kind === this.move.KIND_SPRINT ) {
            // The footballer sprints freely inside a square of size this.move.LEN_SPRINT or less
            var ix;
            var iy;
            var box;
            for ( ix=this.move.sourceBox.ix - this.move.LEN_SPRINT; ix <= this.move.sourceBox.ix + this.move.LEN_SPRINT; ix++ ) {
                if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                    for ( iy=this.move.sourceBox.iy - this.move.LEN_SPRINT; iy <= this.move.sourceBox.iy + this.move.LEN_SPRINT; iy++ ) {
                        if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                            box = this.field.boxes[ix][iy];
                            if ( box !== null && box != this.sourceBox ) {
                                if ( box.canHostFootballer && ! box.hasActiveFootballer() ) {
                                    destinationsWithCosts.push( {box: box, cost: 1} );
                                }
                            }
                        }
                    }
                }
            }
        }
        baltek.debug.writeMessage("moveFindDestinations: exit");
        return destinationsWithCosts;
    }
}
///////////////////////////////////////////////////////////////////////////////
