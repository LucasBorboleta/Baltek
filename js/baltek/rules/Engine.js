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
    };

    baltek.rules.Engine.prototype.exportState = function(){
        var state = {};
        state.activeTeamIndex = this.activeTeam.teamIndex;
        state.ball = this.ball.exportState();
        state.teams = [];
        state.teams[0] = this.teams[0].exportState();
        state.teams[1] = this.teams[1].exportState();
        state.field = this.field.exportState();
        return state;
    };

    baltek.rules.Engine.prototype.getState = function(){
        var state = {};
        state.activeTeam = this.activeTeam;
        state.ball = this.ball.getState();
        state.teams = [];
        state.teams[0] = this.teams[0].getState();
        state.teams[1] = this.teams[1].getState();
        return state;
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

    baltek.rules.Engine.prototype.hasFieldBox = function(ix, iy){
        return ( this.field.boxesByIndices[ix][iy] !== null );
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

    baltek.rules.Engine.prototype.setState = function(state){
        this.field.clearBallAndFootballerBoxes();
        this.setActiveTeam(state.activeTeam);
        this.ball.setState(state.ball);
        this.teams[0].setState(state.teams[0]);
        this.teams[1].setState(state.teams[1]);
    };

    baltek.rules.Engine.prototype.switchActiveAndPassiveTeams = function(){
        var oldActiveTeam = this.activeTeam;
        var oldPassiveTeam = this.passiveTeam;
        this.activeTeam = oldPassiveTeam;
        this.passiveTeam = oldActiveTeam;
    };

    baltek.rules.Engine.prototype.matchInit = function(){
        baltek.debug.writeMessage("matchInit: enter");
        this.match = {};

        this.match.isActive = true;

        this.activeTeam = this.teams[0];
        this.passiveTeam = this.teams[1];

        this.activeTeam.score = 0;
        this.passiveTeam.score = 0;

        this.roundInit();
    };

    baltek.rules.Engine.prototype.roundInit = function(){
        baltek.debug.writeMessage("roundInit: enter");
        this.round = {};

        this.round.isActive = true;

        this.activeTeam.canSprint = true;
        this.passiveTeam.canSprint = true;

        this.activeTeam.haveGoaled = false;
        this.passiveTeam.haveGoaled = false;

        this.field.initBallAndFootballerBoxes();
        this.turnInit();
    };

    baltek.rules.Engine.prototype.turnInit = function(){
        baltek.debug.writeMessage("turnInit: enter");
        this.turn = {};

        this.turn.state = this.getState();

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
    };

    baltek.rules.Engine.prototype.moveInit = function(){
        baltek.debug.writeMessage("moveInit: enter");
        this.move = {};

        this.move.isActive = true;

        this.move.LEN_KICK = 2;
        this.move.LEN_RUN = 1;
        this.move.LEN_SPRINT = 2;

        this.move.sprint = false;
        this.move.sourceBox = null;
        this.move.sourceCost = 0;
        this.move.destinationBox = null;
        this.move.destinationCost = 0;
    };

    baltek.rules.Engine.prototype.matchUpdate = function(){
        baltek.debug.writeMessage("matchUpdate: enter");
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
                    baltek.debug.writeMessage("matchUpdate: this.match.isActive=" + this.match.isActive);
                    this.field.enableBoxes(false);
                    this.activeTeam.enableFootballers(false);
                    this.activeTeam.selectFootballers(false);
                    this.ball.selected = false;
                    this.ball.selectable = false;
                }
            }
        }

        this.notifyObservers();
    };

    baltek.rules.Engine.prototype.roundUpdate = function(){
        baltek.debug.writeMessage("roundUpdate: enter");
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

    baltek.rules.Engine.prototype.turnUpdate = function(){
        baltek.debug.writeMessage("turnUpdate: enter");
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

    baltek.rules.Engine.prototype.turnCancel = function(){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("turnCancel:");
        baltek.utils.assert( this.move.isActive );
        this.setState(this.turn.state);
        this.turnInit();
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.turnConfirm = function(){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("turnConfirm:");
        baltek.utils.assert( this.move.isActive );
        this.turn.isActive = false;
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveUpdate = function(){
        baltek.debug.writeMessage("moveUpdate: enter");
        if ( this.move.isActive ) {

            if ( this.move.sourceBox === null ) {
                this.moveFindSources();

            } else if ( this.move.destinationBox === null ) {
                this.moveFindDestinations();

            } else {
                this.move.isActive = false;

                if ( this.ball.selected ) {
                    this.move.sourceBox.getActiveFootballer().canKick = false;
                    this.move.destinationBox.setBall(this.ball);

                    if (this.move.destinationBox === this.passiveTeam.goalBox ) {
                        this.activeTeam.haveGoaled = true;
                    }

                } else {
                    this.move.sourceBox.getActiveFootballer().canRun = false;
                    this.move.destinationBox.setActiveFootballer(this.move.sourceBox.getActiveFootballer());

                    if ( this.move.sprint ) {
                        this.activeTeam.canSprint = false;
                    }
                }

                this.activeTeam.credit -= ( this.move.sourceCost + this.move.destinationCost );
            }
        }
    };

    baltek.rules.Engine.prototype.moveSprint = function(condition){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("moveSprint:");

        baltek.utils.assert( this.move.isActive );
        if ( condition ) {
            baltek.utils.assert( this.activeTeam.canSprint );
            this.move.sprint = true;
        } else {
            this.move.sprint = false;
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSelectBall = function(condition){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("moveSelectBall: condition=" + condition);

        baltek.utils.assert( this.move.isActive );

        if ( condition ) {
            baltek.utils.assert( this.move.sourceBox === null );
            baltek.utils.assert( this.ball.selectable );
            this.move.sourceBox = this.ball.box;
            this.move.sourceCost = this.ball.cost;
            this.ball.selected = true;

        } else {
            baltek.utils.assert( this.move.sourceBox !== null );
            baltek.utils.assert( this.move.sourceBox === this.ball.box );
            baltek.utils.assert( this.ball.selected );
            this.move.sourceBox = null;
            this.move.sourceCost = 0;
            this.ball.selected = false;
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSelectFootballer = function(boxIndices, condition){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("moveSelectFootballer: condition=" + condition);

        baltek.utils.assert( this.move.isActive );

        var box = this.field.boxesByIndices[boxIndices.ix][boxIndices.iy];
        baltek.utils.assert( box !== null );

        var activeFootballer = box.getActiveFootballer();
        baltek.utils.assert( activeFootballer !== null );

        if ( condition ) {
            baltek.utils.assert( this.move.sourceBox === null );
            baltek.utils.assert( activeFootballer.selectable );
            this.move.sourceBox = box;
            this.move.sourceCost = activeFootballer.cost;
            activeFootballer.selected = true;

        } else {
            baltek.utils.assert( this.move.sourceBox !== null );
            baltek.utils.assert( this.move.sourceBox === box );
            baltek.utils.assert( activeFootballer.selected );
            this.move.sourceBox = null;
            this.move.sourceCost = 0;
            activeFootballer.selected = false;
        }
        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveSelectBox = function(boxIndices){
        // Triggered by the player of the activeTeam
        baltek.debug.writeMessage("moveSelectBox:");

        baltek.utils.assert( this.move.isActive );
        baltek.utils.assert( this.move.sourceBox !== null );
        baltek.utils.assert( this.move.destinationBox === null );

        var box = this.field.boxesByIndices[boxIndices.ix][boxIndices.iy];
        baltek.utils.assert( box !== null );
        baltek.utils.assert( box.selectable );

        this.move.destinationBox = box;
        this.move.destinationCost = box.cost;
        box.selected = true;

        this.matchUpdate();
    };

    baltek.rules.Engine.prototype.moveFindSources = function(){
        baltek.debug.writeMessage("moveFindSources: enter");

        if ( this.move.isActive && this.move.sourceBox === null ) {
            this.field.enableBoxes(false);
            this.activeTeam.enableFootballers(false);
            this.activeTeam.selectFootballers(false);
            this.ball.selected = false;
            this.ball.selectable = false;

            var activeFootballer = null;
            var passiveFootballer = null;
            var n = this.activeTeam.footballers.length;
            var i;

            this.ball.cost = 0;
            this.ball.selectable = false;

            for ( i=0; i<n; i++ ) {
                activeFootballer = this.activeTeam.footballers[i];

                if ( activeFootballer.canRun ) {
                    // The activeFootballer has not run during this turn
                    activeFootballer.cost = 0;
                    activeFootballer.selectable = ( this.activeTeam.credit >= activeFootballer.cost );
                }

                if ( activeFootballer.canKick && activeFootballer.box.hasBall() ) {
                    // The activeFootballer has not kick during this turn
                    passiveFootballer = activeFootballer.box.getPassiveFootballer();

                    if ( passiveFootballer === null ) {
                        this.ball.cost = 0;
                        this.ball.selectable = ( this.activeTeam.credit >= this.ball.cost );

                    } else if ( activeFootballer.force >= passiveFootballer.force ) {
                        this.ball.cost = 0;
                        this.ball.selectable = ( this.activeTeam.credit >= this.ball.cost );

                    } else {
                        this.ball.cost = passiveFootballer.force - activeFootballer.force;
                        this.ball.selectable = ( this.activeTeam.credit >= this.ball.cost );
                    }
                }
            }
        }
    };

    baltek.rules.Engine.prototype.moveFindDestinations = function(){
        baltek.debug.writeMessage("moveFindDestinations: enter");

        if ( ! this.move.isActive ) return;
        if ( this.move.sourceBox === null ) return;
        if ( this.move.destinationBox !== null ) return;

        this.field.enableBoxes(false);
        this.activeTeam.enableFootballers(false);

        // Let actual source selectable in order to allowing unselect it
        if ( this.ball.selected ) {
            this.ball.selectable = true;
        } else {
            this.ball.selectable = false;
            this.move.sourceBox.getActiveFootballer().selectable = true;
        }

        var activeFootballer = this.move.sourceBox.footballers[this.activeTeam.teamIndex];

        var ux=0;
        var uy=0;
        var d=0;
        var dx=0;
        var dy=0;
        var ix=0;
        var iy=0;
        var box=null;

        if ( this.ball.selected ) {
            // The ball moves along a vector of size this.move.LEN_KICK or less

            for ( ux=-1; ux<=1; ux++ ) {
                for ( uy=-1; uy<=1; uy++ ) {
                    for ( d=1; d <= this.move.LEN_KICK; d++) {
                        dx = d*ux;
                        dy = d*uy;
                        ix = this.move.sourceBox.ix + dx;
                        iy = this.move.sourceBox.iy + dy;
                        if ( ix >= this.field.firstX && ix <= this.field.lastX && iy >= this.field.firstY && iy <= this.field.lastY ) {
                            box = this.field.boxesByIndices[ix][iy];
                            if ( box !== null && box != this.move.sourceBox && box.canHostBall && box !== this.activeTeam.goalBox ) {
                                if ( d <= 1) {
                                    box.cost = 1;
                                    box.selectable = ( this.activeTeam.credit >= this.move.sourceCost + box.cost );
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
                                        tbox = this.field.boxesByIndices[jx][jy];
                                        if ( tbox !== null && tbox.hasPassiveFootballer() ) {
                                            if ( strongestPassiveFootballer === null ) {
                                                strongestPassiveFootballer = tbox.getPassiveFootballer();
                                            } else if ( tbox.getPassiveFootballer().force > strongestPassiveFootballer ) {
                                                strongestPassiveFootballer = tbox.getPassiveFootballer();
                                            }
                                        }
                                    }

                                    if ( strongestPassiveFootballer === null ) {
                                        box.cost = 1;
                                        box.selectable = ( this.activeTeam.credit >= this.move.sourceCost + box.cost );

                                    } else if ( activeFootballer.force >= strongestPassiveFootballer.force ) {
                                        box.cost = 1;
                                        box.selectable = ( this.activeTeam.credit >= this.move.sourceCost + box.cost );

                                    } else {
                                        box.cost = 1 + strongestPassiveFootballer.force - activeFootballer.force;
                                        box.selectable = ( this.activeTeam.credit >= this.move.sourceCost + box.cost );
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
            for ( ix=this.move.sourceBox.ix - runLength; ix <= this.move.sourceBox.ix + runLength; ix++ ) {
                if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                    for ( iy=this.move.sourceBox.iy - runLength; iy <= this.move.sourceBox.iy + runLength; iy++ ) {
                        if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                            box = this.field.boxesByIndices[ix][iy];
                            if ( box !== null && box != this.move.sourceBox ) {
                                if ( box.canHostFootballer && ! box.hasActiveFootballer() ) {
                                    box.cost = 1;
                                    box.selectable = ( this.activeTeam.credit >= this.move.sourceCost + box.cost );
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};
///////////////////////////////////////////////////////////////////////////////
