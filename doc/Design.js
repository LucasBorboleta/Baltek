"use strict";
///////////////////////////////////////////////////////////////////////////////
// This file does not contain production code.
// This files just helps thinking about the design.

// Study of abstract interaction between the RulesEngine and its obervers.
// The observers includes the Presenter, the AI Player, the remote Player or the remote Presenter

///////////////////////////////////////////////////////////////////////////////
// Triggered by the Presenter

var rulesEngine = new Baltek.RulesEngine();

rulesEngine.registerObserver(presenter, aspect1);
rulesEngine.registerObserver(presenter, aspect2);
rulesEngine.registerObserver(presenter, aspect3);

presenter {
    this.engine.getFieldNx();
    this.engine.getFieldNy();
}
rulesEngine.matchInit();
rulesEngine.matchUpdate();

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Ball.prototype.$init = function(){
    this.box = null;
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Footballer.prototype.$init = function(team, force){
    this.team = team;
    this.force = force;
    this.box = null;
    this.canKick = false;
    this.canRun = false;
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Team.prototype.$init = function(engine, teamIndex){
    this.engine = engine ;
    this.teamIndex = teamIndex ;
    this.player = null;
    this.goalBox = null;
    this.score = 0;
    this.canSprint = false;
    this.haveGoaled = false;
    this.credit = 0;

    // Populate the team
    this.footballer3 = new Baltek.RulesEngine.Footballer(this, 3);
    this.footballer2t = new Baltek.RulesEngine.Footballer(this, 2);
    this.footballer2m = new Baltek.RulesEngine.Footballer(this, 2);
    this.footballer1t = new Baltek.RulesEngine.Footballer(this, 1);
    this.footballer1m = new Baltek.RulesEngine.Footballer(this, 1);
    this.footballer1b = new Baltek.RulesEngine.Footballer(this, 1);

    this.footballers = [];
    this.footballers.push(this.footballer3);
    this.footballers.push(this.footballer2t); // force 2 @ top
    this.footballers.push(this.footballer2b); // force 2 @ bottom
    this.footballers.push(this.footballer1t); // force 1 @ top
    this.footballers.push(this.footballer1m); // force 1 @ middle
    this.footballers.push(this.footballer1b); // force 1 @ botom
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Field.prototype.$init = function(engine){
    this.engine = engine;
    this.ns = 5; // Number of boxes on the side of each team
    this.ny = this.ns ;
    this.nx = 2*( this.ns + 1 ) ;

    this.firstX = 0;
    this.lastX = this.nx - 1;
    this.middleX = Math.round((this.firstX + this.lastX)/2);

    this.firstY = 0;
    this.lastY = this.ny - 1;
    this.middleY = Math.round((this.firstY + this.lastY)/2);

    this.boxesByIndices = [] ;

    var box = null;

    for ( var ix=this.firstX; ix<=this.lastX; ix++ ) {
        this.boxesByIndices.push([]);

        for ( var iy=this.firstY; iy<=this.lastY; iy++ ) {
            this.boxesByIndices[ix].push(null);

            if ( ix === this.firstX || ix === this.lastX ) {
                if ( iy === this.middleY ) {
                    box = new Baltek.RulesEngine.Box(this.engine, ix , iy);
                    box.canHostBall = true;
                    box.canHostFootballer = false;
                    this.boxesByIndices[ix][iy] = box;
                }
            } else {
                box = new Baltek.RulesEngine.Box(this.engine, ix , iy);
                box.canHostBall = true;
                box.canHostFootballer = true;
                this.boxesByIndices[ix][iy] = box;
            }
        }
    }

    var activeIndex = this.engine.activeTeam.teamIndex;
    var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
    var activeDirectionX = 1 - 2*activeIndex

    var agix =  activeOriginX;
    var agiy = this.middleY;
    this.engine.activeTeam.goalBox = this.boxesByIndices[agix][agiy] ;

    var passiveIndex = this.engine.passiveTeam.teamIndex;
    var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
    var passiveDirectionX = 1 - 2*passiveIndex

    var pgix =  passiveOriginX;
    var pgiy = this.middleY;
    this.engine.passiveTeam.goalBox = this.boxesByIndices[pgix][pgiy] ;
}

Baltek.RulesEngine.Field.prototype.initBallAndTeamsBoxes = function(){
    var box = null;
    for ( var ix=this.firstX; ix<=this.lastX; ix++ ) {
        for ( var iy=this.firstY; iy<=this.lastY; iy++ ) {
            box = this.boxesByIndices[ix][iy];
            if ( box !== null ) {
                box.footballers[this.engine.activeTeam.teamIndex] = null;
                box.footballers[this.engine.passiveTeam.teamIndex] = null;
            }
        }
    }

    this.engine.ball.box = null;

    var n = 0;
    n = this.engine.activeTeam.footballers.length;
    for ( i=0; i<n; i++) {
        this.engine.activeTeam.footballers[i].box = null;
    }
    n = this.engine.passiveTeam.footballers.length;
    for ( i=0; i<n; i++) {
        this.engine.passiveTeam.footballers[i].box = null;
    }

    var activeIndex = this.engine.activeTeam.teamIndex;
    var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
    var activeDirectionX = 1 - 2*activeIndex

    this.boxesByIndices[activeOriginX + this.ns*activeDirectionX][this.middleY].setBall(this.engine.ball);

    this.boxesByIndices[activeOriginX + this.ns*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer3);
    this.boxesByIndices[activeOriginX + this.ns*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer2t);
    this.boxesByIndices[activeOriginX + this.ns*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer2b);
    this.boxesByIndices[activeOriginX + (this.ns - 2)*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer1t);
    this.boxesByIndices[activeOriginX + (this.ns - 2)*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer1m);
    this.boxesByIndices[activeOriginX + (this.ns - 2)*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer1b);

    var passiveIndex = this.engine.passiveTeam.teamIndex;
    var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
    var passiveDirectionX = 1 - 2*passiveIndex

    this.boxesByIndices[passiveOriginX + (this.ns - 1)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer3);
    this.boxesByIndices[passiveOriginX + this.ns*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer2t);
    this.boxesByIndices[passiveOriginX + this.ns*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer2b);
    this.boxesByIndices[passiveOriginX + (this.ns - 2)*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer1t);
    this.boxesByIndices[passiveOriginX + (this.ns - 2)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer1m);
    this.boxesByIndices[passiveOriginX + (this.ns - 2)*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer1b);
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Box.prototype.$init = function(engine, ix, iy){
    this.engine = engine;
    this.ix = ix ;
    this.iy = iy ;
    this.canHostBall = false;
    this.canHostFootballer = false;
    this.ball = null ;
    this.footballers = [] ;
    this.footballers.push(null);
    this.footballers.push(null);
}

Baltek.RulesEngine.Box.prototype.setBall = function(ball){
    assert ( ball !== null )

    if ( this.ball !== ball ) {
        assert ( this.ball === null )

        if ( ball.box !== null ) {
            ball.box.ball = null;
        }
        this.ball = ball;
        ball.box = this;
    }
}

Baltek.RulesEngine.Box.prototype.getBall = function(){
    return this.ball;
}

Baltek.RulesEngine.Box.prototype.hasBall = function(){
    return ( this.ball !== null );
}

Baltek.RulesEngine.Box.prototype.setActiveFootballer = function(footballer){
    assert ( footballer !== null )
    assert ( footballer.team.teamIndex === this.engine.activeTeam.teamIndex )

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        assert ( this.footballers[footballer.team.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}

Baltek.RulesEngine.Box.prototype.getActiveFootballer = function(){
    return this.footballers[this.engine.activeTeam.teamIndex];
}

Baltek.RulesEngine.Box.prototype.hasActiveFootballer = function(){
    return ( this.footballers[this.engine.activeTeam.teamIndex] !== null );
}

Baltek.RulesEngine.Box.prototype.setPassiveFootballer = function(footballer){
    assert ( footballer !== null )
    assert ( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex )

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        assert ( this.footballers[footballer.team.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}

Baltek.RulesEngine.Box.prototype.getPassiveFootballer = function(){
    return this.footballers[this.engine.passiveTeam.teamIndex];
}

Baltek.RulesEngine.Box.prototype.hasPassiveFootballer = function(){
    return ( this.footballers[this.engine.passiveTeam.teamIndex] !== null );
}

///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.prototype.$init = function(){

    var BLUE_INDEX = 0;
    var RED_INDEX = 1;
    this.blueTeam = new Baltek.RulesEngine.Team(this, BLUE_INDEX);
    this.redTeam = new Baltek.RulesEngine.Team(this, RED_INDEX);

    this.activeTeam = this.blueTeam;
    this.passiveTeam = this.redTeam;

    this.ball = new Baltek.RulesEngine.Ball();

    this.field = new Baltek.RulesEngine.Field(this);
    this.field.initBallAndTeamsBoxes();
}

Baltek.RulesEngine.prototype.switchActiveAndPassiveTeams = function(){
    var oldActiveTeam = this.activeTeam;
    var oldPassiveTeam = this.passiveTeam;
    this.activeTeam = this.oldPassiveTeam;
    this.passiveTeam = this.oldActiveTeam;
}

Baltek.RulesEngine.prototype.setActiveTeam = function(activeTeam){
    if ( activeTeam !== this.activeTeam ) {
        this.switchActiveAndPassiveTeams();
    }
}

Baltek.RulesEngine.prototype.setPassiveTeam = function(passiveTeam){
    if ( passiveTeam !== this.passiveTeam ) {
        this.switchActiveAndPassiveTeams();
    }
}

Baltek.RulesEngine.prototype.matchInit = function(){
    this.match.isActive = true;
    this.match.SCORE_MAX = 2;

    this.activeTeam = this.blueTeam;
    this.passiveTeam = this.redTeam;

    this.activeTeam.score = 0;
    this.passiveTeam.score = 0;

    this.roundInit();
}

Baltek.RulesEngine.prototype.roundInit = function(){
    this.round.isActive = true;

    this.activeTeam.canSprint = true;
    this.passiveTeam.canSprint = true;

    this.activeTeam.haveGoaled = false;
    this.passiveTeam.haveGoaled = false;

    this.field.initBallAndTeamsBoxes();
    this.turnInit();
}

Baltek.RulesEngine.prototype.turnInit = function(){
    this.turn.isActive = true;
    this.turn.CREDIT_MAX = 3;

    this.activeTeam.credit = this.turn.CREDIT_MAX;
    this.passiveTeam.credit = 0;

    this.moveInit();
}

Baltek.RulesEngine.prototype.moveInit = function(){
    this.move.isActive = true;

    this.move.KIND_RUN = 900;
    this.move.KIND_SPRINT = 901;
    this.move.KIND_KICK = 902;

    this.move.LEN_KICK = 2;
    this.move.LEN_RUN = 1;
    this.move.LEN_SPRINT = 2;

    this.move.sources = null;
    this.move.kindsWithCosts = null;
    this.move.destinationsWithCosts = null;

    this.move.sourceBox = null;
    this.move.kind = null;
    this.move.kindCost = 0;
    this.move.destinationBox = null;
    this.move.destinationCost = 0;
}

Baltek.RulesEngine.prototype.matchUpdate = function(){
    if ( this.match.isActive ) {
        this.roundUpdate();

        if ( ! this.round.isActive ) {

            if ( this.activeTeam.haveGoaled ) {
                this.activeTeam.score += 1

                if ( this.activeTeam.score >= this.match.SCORE_MAX || this.passiveTeam.score >= this.match.SCORE_MAX ) {
                    this.match.isActive = false;
                }
            }

            if ( this.match.isActive ) {
                this.switchActiveAndPassiveTeams();
                this.roundInit();
            }
        }
    }
}

Baltek.RulesEngine.prototype.roundUpdate = function(){
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

Baltek.RulesEngine.prototype.turnUpdate = function(){
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

Baltek.RulesEngine.prototype.turnStop = function(){
    // Triggered by the player of the activeTeam

    if ( this.turn.isActive ) {
        this.turn.isActive = false;
        this.matchUpdate();
    }
}

Baltek.RulesEngine.prototype.moveUpdate = function(){
    if ( this.move.isActive ) {

        if ( this.move.sourceBox !== null ) {

            if ( this.move.kind !== null ) {

                if ( this.move.destinationBox !== null ) {
                    this.move.isActive = false;

                    if ( this.move.kind == this.move.KIND_RUN || this.move.kind == this.move.KIND_SPRINT ) {
                        this.move.destinationBox.setActiveFootballer(this.move.sourceBox.getActiveFootballer());

                    } else if ( this.move.kind == this.move.KIND_KICK ) {
                        this.move.destinationBox.setBall(this.move.sourceBox.getBall());
                    }

                    this.activeTeam.credit -= ( this.move.kindCost + this.move.destinationCost );

                    if (this.move.destinationBox === this.passiveTeam.goalBox ) {
                        this.activeTeam.haveGoaled = true;
                    }

                } else {
                    // this.move.destinationBox === null
                    this.move.destinationsWithCosts = this.moveFindDestinationsWithCosts();
                    // notify the player of the activeTeam
                }

            } else {
                // this.move.kind === null
                this.move.kindsWithCosts = this.moveFindKindsWithCosts();
                // notify the player of the activeTeam

            }
        } else {
            // this.move.sourceBox === null
            this.move.sources = this.moveFindSources();
            // notify the player of the activeTeam

        }
    }
}

Baltek.RulesEngine.prototype.moveSelectSource = function(source){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive ) {
        if ( this.move.sourceBox === null ) {
            if ( Baltek.Utils.hasValue(this.move.sources, source) ) {
                this.move.sourceBox = source;
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveUnselectSource = function(source){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive ) {
        if ( this.move.sourceBox !== null ) {
            // this.move.sources is kept
            this.move.kindsWithCosts = null;
            this.move.destinationsWithCosts = null;

            this.move.sourceBox = null;
            this.move.kind = null;
            this.move.kindCost = 0;
            this.move.destinationBox = null;
            this.move.destinationCost = 0;

            this.matchUpdate();
        }
    }
}

Baltek.RulesEngine.prototype.moveSelectKind = function(kindWithCost){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceBox !== null ) {
        if ( this.move.kind === null ) {
            if ( Baltek.Utils.hasValue(this.move.kindsWithCosts, kindWithCost) ) {
                this.move.kind = kindWithCost.kind;
                this.move.kindCost = kindWithCost.kindCost;
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveUnselectKind = function(){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceBox !== null ) {
        if ( this.move.kind !== null ) {
            // this.move.sources is kept
            // this.move.kindsWithCosts is kept;
            this.move.destinationsWithCosts = null;

            this.move.kind = null;
            this.move.kindCost = 0;
            this.move.destinationBox = null;
            this.move.destinationCost = 0;

            this.matchUpdate();
        }
    }
}

Baltek.RulesEngine.prototype.moveSelectDestination = function(destinationWithCost){
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

Baltek.RulesEngine.prototype.moveFindSources = function(){
    var sources = [];
        if ( this.move.isActive && this.move.sourceBox === null ) {
        var n = this.activeTeam.footballers.length;
        var i;
        var footballer;
        for ( i=0; i<n; i++ ) {
            footballer = this.activeTeam.footballers[i];

            if ( footballer.canRun ) {
                // The footballer has not run during this turn
                sources.push(footballer.box);

            } else if ( footballer.canKick && footballer.box.hasBall() ) {
                // The footballer has not kick during this turn
                sources.push(footballer.box);
            }
        }
    }
    return sources;
}

Baltek.RulesEngine.prototype.moveFindKindsWithCosts = function(){

    var kindsWithCosts = [];

    if ( this.move.isActive && this.move.sourceBox !== null && this.move.kind === null ) {

        var activeFootballer = this.move.sourceBox.getActiveFootballer();
        var passiveFootballer = this.move.sourceBox.getPassiveFootballer();
        var sourceHasBall = this.move.sourceBox.hasBall();

        if ( activeFootballer.canRun ) {
            kindsWithCosts.push( { kind: this.move.KIND_RUN, cost: 0} );

            if ( this.activeTeam.canSprint ) {
                kindsWithCosts.push( { kind: this.move.KIND_SPRINT, cost: 0} );
            }
        }

        if ( activeFootballer.canKick && sourceHasBall ) {
            if ( passiveFootballer === null ) {
                kindsWithCosts.push( { kind: this.move.KIND_KICK, cost: 0} );

            } else if { activeFootballer.force >= passiveFootballer.force } {
                kindsWithCosts.push( { kind: this.move.KIND_KICK, cost: 0} );

            } else {
                var cost = passiveFootballer.force - activeFootballer.force;
                if ( this.activeTeam.credit >= cost ) {
                    kindsWithCosts.push( { kind: this.move.KIND_KICK, cost: cost} );
                }
            }
        }
    }
    return kindsWithCosts;
}

Baltek.RulesEngine.prototype.moveFindDestinationsWithCosts = function(){
    var destinationsWithCosts = [] ;

    var preconditions = (   this.move.isActive &&
                            this.move.sourceBox !== null &&
                            this.move.kind !== null &&
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
                    if ( ix >= this.field.firstX && ix <= this.field.lastX &&
                         iy >= this.field.firstY && iy <= this.field.lastY ) {
                             box = this.field.boxes[ix][iy];
                             if ( box !== null && box != this.source && box.canHostBall && box !== this.activeTeam.goalBox ) {
                                 if ( d <= 1) {
                                     destinationsWithCosts.push( {box: box, cost: 0} );
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
                                         destinationsWithCosts.push( {box: box, cost: 0} );

                                     } else if ( activeFootballer.force >= strongestPassiveFootballer.force ) {
                                         destinationsWithCosts.push( {box: box, cost: 0} );

                                     } else {
                                         var cost = strongestPassiveFootballer.force - activeFootballer.force;
                                         if ( this.activeTeam.credit >= this.move.kindCost + cost ) {
                                             destinationsWithCosts.push( {box: box, cost: kickCost} );
                                         }
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
        for ( ix=this.move.sourceBox.ix - this.move.LEN_RUN; ix <= this.move.sourceBox.ix + this.move.LEN_RUN; ix++ = {
            if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                for ( iy=this.move.sourceBox.iy - this.move.LEN_RUN; iy <= this.move.sourceBox.iy + this.move.LEN_RUN; iy++ = {
                    if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                        box = this.field.boxes[ix][iy];
                        if ( box !== null && box != this.sourceBox ) {
                            if ( box.canHostFootballer && ! box.hasActiveFootballer() ) {
                                destinationsWithCosts.push( {box: box, cost: 0} );
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
        for ( ix=this.move.sourceBox.ix - this.move.LEN_SPRINT; ix <= this.move.sourceBox.ix + this.move.LEN_SPRINT; ix++ = {
            if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                for ( iy=this.move.sourceBox.iy - this.move.LEN_SPRINT; iy <= this.move.sourceBox.iy + this.move.LEN_SPRINT; iy++ = {
                    if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                        box = this.field.boxes[ix][iy];
                        if ( box !== null && box != this.sourceBox ) {
                            if ( box.canHostFootballer && ! box.hasActiveFootballer() ) {
                                destinationsWithCosts.push( {box: box, cost: 0} );
                            }
                        }
                    }
                }
            }
        }
    }
    return destinationsWithCosts;
}

///////////////////////////////////////////////////////////////////////////////
baltek.presenter.State = function(presenter, parentState){
    this.$init(presenter, parentState);
};

baltek.utils.inherit(baltek.presenter.State, Object);

baltek.presenter.State.prototype.$init = function(presenter, parentState){
    this.presenter = presenter;

    if ( parentState !== undefined ) {
        this.parentState = parentState;
    } else {
        this.parentState = null;
    }
}

baltek.presenter.State.prototype.changeState = function(newState){
    baltek.utils.assert( newState !== this.presenter.state );

    if ( this.presenter.state !== null ) {
        this.presenter.state.exit();
    }

    if ( newState !== null ) {
        baltek.utils.assert( this.parentState.hasSubstate(newState) );
        this.presenter.state = newState;
        this.presenter.state.enter();
    } else {
        // This is a final state
        this.presenter.state = newState;
    }
}

baltek.presenter.State.prototype.enter = function(){
}

baltek.presenter.State.prototype.exit = function(){
}

baltek.presenter.State.prototype.updateFromObservable = function(observable){
    if ( this.parentState !== null ) {
        this.parentState.updateFromObservable = function(observable);
    } else {
        baltek.utils.assert( false, "observable not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.CompositeState = function(presenter, parentState){
    this.$init(presenter, parentState);
};

baltek.utils.inherit(baltek.presenter.CompositeState, baltek.presenter.State);

baltek.presenter.CompositeState.prototype.$init = function(presenter, parentState){
    baltek.presenter.CompositeState.super.$init.call(this, presenter, parentState);
    this.substate = null;
    this.enabledHistory = false;
    this.initSubstates();
}

baltek.presenter.CompositeState.prototype.enableHistory = function(condition){
    this.enabledHistory = condition;
}

baltek.presenter.CompositeState.prototype.enter = function(){
    if ( this.substate === null ) {
        this.substate = this.getDefaultSubstate();
        baltek.utils.assert( this.substate !== null );
    }

    this.substate.enter();
}

baltek.presenter.CompositeState.prototype.exit = function(){
    this.substate.exit();

    if ( ! this.enabledHistory ) {
        this.substate = null;
    }
}

baltek.presenter.CompositeState.prototype.getDefaultSubstate = function(){
    baltek.utils.assert( false, "must be redefined" );
    return null;
}

baltek.presenter.CompositeState.prototype.hasSubstate = function(substate){
    baltek.utils.assert( false, "must be redefined" );
    return false;
}

baltek.presenter.CompositeState.prototype.initSubstates = function(){
    baltek.utils.assert( false, "must be redefined" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.TopState = function(presenter){
    this.$init(presenter);
};

baltek.utils.inherit(baltek.presenter.TopState, baltek.presenter.State);

baltek.presenter.TopState.prototype.$init = function(presenter){
    baltek.presenter.TopState.super.$init.call(this, presenter);

    // A CompositeState initializes its substates
    this.substate1 = new baltek.presenter.Substate1(presenter);
    this.substate2 = new baltek.presenter.Substate2(presenter);
    this.substate3 = new baltek.presenter.Substate3(presenter);
}

baltek.presenter.TopState.prototype.enter = function(observable){
    if ( observable === null) {

        if ( this.substate === null ) {
            var defaultSubstate = this.getDefaultSubstate();
            baltek.utils.assert( defaultSubstate !== null);
            this.substate = defaultSubstate;
        }

    } else {
        // Select the substate from the observable
        this.updateFromObservable(observable);
    }

    baltek.utils.assert( this.substate !== null);
    this.substate.enter(null);
}

baltek.presenter.TopState.prototype.exit = function(){
    this.substate = null;
    // No reset if historical substate must be kept
}

baltek.presenter.TopState.prototype.getDefaultSubstate = function(){
    return this.substate1;
}

baltek.presenter.TopState.prototype.updateFromObservable = function(observable){
    // Define the managed events as managed observables
    if ( observable === this.startGame ) {
        this.state.updateFromStartGame(observable);
    } else {
        baltek.utils.assert( false, "observable not managed" );
    }
}

baltek.presenter.TopState.prototype.updateFromStartGame = function(observable){
    // A composite state

}

///////////////////////////////////////////////////////////////////////////////
