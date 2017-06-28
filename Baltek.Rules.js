"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules = { $initCalled: false };

baltek.rules.$init = function(){
    if ( ! baltek.rules.$initCalled ) {
        baltek.rules.$initCalled = true;

        // Init any package used by this one
        baltek.utils.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Ball = function(){
    this.$init();
};

baltek.utils.inherit(baltek.rules.Ball, Object);

baltek.rules.Ball.prototype.$init = function(){
    this.box = null;
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Box = function(engine, ix, iy){
    this.$init(engine, ix, iy);
};

baltek.utils.inherit(baltek.rules.Box, Object);

baltek.rules.Box.prototype.$init = function(engine, ix, iy){
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

baltek.rules.Box.prototype.getActiveFootballer = function(){
    return this.footballers[this.engine.activeTeam.teamIndex];
}

baltek.rules.Box.prototype.getBall = function(){
    return this.ball;
}

baltek.rules.Box.prototype.getPassiveFootballer = function(){
    return this.footballers[this.engine.passiveTeam.teamIndex];
}

baltek.rules.Box.prototype.hasActiveFootballer = function(){
    return ( this.footballers[this.engine.activeTeam.teamIndex] !== null );
}

baltek.rules.Box.prototype.hasBall = function(){
    return ( this.ball !== null );
}

baltek.rules.Box.prototype.hasPassiveFootballer = function(){
    return ( this.footballers[this.engine.passiveTeam.teamIndex] !== null );
}

baltek.rules.Box.prototype.setActiveFootballer = function(footballer){
    baltek.utils.assert( footballer !== null ),
    baltek.utils.assert( footballer.team.teamIndex === this.engine.activeTeam.teamIndex );

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null );

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}

baltek.rules.Box.prototype.setBall = function(ball){
    baltek.utils.assert( ball !== null );

    if ( this.ball !== ball ) {
        baltek.utils.assert( this.ball === null );

        if ( ball.box !== null ) {
            ball.box.ball = null;
        }
        this.ball = ball;
        ball.box = this;
    }
}

baltek.rules.Box.prototype.setPassiveFootballer = function(footballer){
    baltek.utils.assert( footballer !== null );
    baltek.utils.assert( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex );

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Engine = function(){
    this.$init();
};

baltek.utils.inherit(baltek.rules.Engine, baltek.utils.Observable);


baltek.rules.Engine.prototype.$init = function(){
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
    this.field.initBallAndTeamsBoxes();
}

baltek.rules.Engine.prototype.getActiveTeamIndex = function(){
    return this.activeTeam.teamIndex;
}

baltek.rules.Engine.prototype.getBallBoxIndices = function(){
    return { ix:this.ball.box.ix, iy:this.ball.box.iy };
}

baltek.rules.Engine.prototype.getCredit = function(teamIndex){
    return this.teams[teamIndex].credit;
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

baltek.rules.Engine.prototype.getFooballerBoxIndices = function(teamIndex, footballerIndex){
    var box = this.teams[teamIndex].footballers[footballerIndex].box;
    return { ix:box.ix, iy:box.iy };
}

baltek.rules.Engine.prototype.getFooballerCount = function(teamIndex){
    return this.teams[teamIndex].footballers.length;
}

baltek.rules.Engine.prototype.getFooballerForce = function(teamIndex, footballerIndex){
    return this.teams[teamIndex].footballers[footballerIndex].force;
}

baltek.rules.Engine.prototype.getScore = function(teamIndex){
    return this.teams[teamIndex].score;
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

baltek.rules.Engine.prototype.switchActiveAndPassiveTeams = function(){
    var oldActiveTeam = this.activeTeam;
    var oldPassiveTeam = this.passiveTeam;
    this.activeTeam = this.oldPassiveTeam;
    this.passiveTeam = this.oldActiveTeam;
}

// TODO: clean the next methods

baltek.rules.Engine.prototype.matchInit = function(){
    this.match = {};

    this.match.isActive = true;

    this.activeTeam = this.teams[0];
    this.passiveTeam = this.teams[1];

    this.activeTeam.score = 0;
    this.passiveTeam.score = 0;

    this.roundInit();
}

baltek.rules.Engine.prototype.roundInit = function(){
    this.round = {};

    this.round.isActive = true;

    this.activeTeam.canSprint = true;
    this.passiveTeam.canSprint = true;

    this.activeTeam.haveGoaled = false;
    this.passiveTeam.haveGoaled = false;

    this.field.initBallAndTeamsBoxes();
    this.turnInit();
}

baltek.rules.Engine.prototype.turnInit = function(){
    this.turn = {};

    this.turn.isActive = true;

    this.activeTeam.credit = this.CREDIT_MAX;
    this.passiveTeam.credit = 0;

    this.teams[0].initFootballerCapabilities();
    this.teams[1].initFootballerCapabilities();

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

    this.move.sources = null;
    this.move.kindsWithCosts = null;
    this.move.destinationsWithCosts = null;

    this.move.sourceBox = null;
    this.move.kind = null;
    this.move.kindCost = 0;
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

baltek.rules.Engine.prototype.turnStop = function(){
    // Triggered by the player of the activeTeam

    if ( this.turn.isActive ) {
        this.turn.isActive = false;
        this.matchUpdate();
    }
}

baltek.rules.Engine.prototype.moveUpdate = function(){
    if ( this.move.isActive ) {

        if ( this.move.sourceBox !== null ) {

            if ( this.move.kind !== null ) {

                if ( this.move.destinationBox !== null ) {
                    this.move.isActive = false;

                    if ( this.move.kind == this.move.KIND_RUN || this.move.kind == this.move.KIND_SPRINT ) {
                        this.move.sourceBox.getActiveFootballer().canRun = false;
                        this.move.destinationBox.setActiveFootballer(this.move.sourceBox.getActiveFootballer());

                    } else if ( this.move.kind == this.move.KIND_KICK ) {
                        this.move.sourceBox.getActiveFootballer().canKick = false;
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

baltek.rules.Engine.prototype.moveSelectSource = function(source){
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

baltek.rules.Engine.prototype.moveUnselectSource = function(source){
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

baltek.rules.Engine.prototype.moveSelectKind = function(kindWithCost){
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

baltek.rules.Engine.prototype.moveUnselectKind = function(){
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

baltek.rules.Engine.prototype.moveFindKindsWithCosts = function(){

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

            } else if ( activeFootballer.force >= passiveFootballer.force ) {
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

baltek.rules.Engine.prototype.moveFindDestinationsWithCosts = function(){
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
                    if ( ix >= this.field.firstX && ix <= this.field.lastX && iy >= this.field.firstY && iy <= this.field.lastY ) {
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
        for ( ix=this.move.sourceBox.ix - this.move.LEN_SPRINT; ix <= this.move.sourceBox.ix + this.move.LEN_SPRINT; ix++ ) {
            if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                for ( iy=this.move.sourceBox.iy - this.move.LEN_SPRINT; iy <= this.move.sourceBox.iy + this.move.LEN_SPRINT; iy++ ) {
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
baltek.rules.Field = function(engine){
    this.$init(engine);
};

baltek.utils.inherit(baltek.rules.Field, Object);

baltek.rules.Field.prototype.$init = function(engine){
    this.engine = engine;

    // Team square side
    // (The team square is the set of boxes that can be occupied by the
    // footballers of a given team at each kickoff)
    this.TSS = 5;

    // Number of box rows
    this.ny = this.TSS ;

    // Number of box rows, including goal boxes
    this.nx = 2*( this.TSS + 1 ) ;

    this.firstX = 0;
    this.lastX = this.nx - 1;
    this.middleX = Math.round((this.firstX + this.lastX)/2);

    this.firstY = 0;
    this.lastY = this.ny - 1;
    this.middleY = Math.round((this.firstY + this.lastY)/2);

    this.boxesByIndices = [] ;

    var box = null;
    var ix = 0;
    var iy = 0;

    for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
        this.boxesByIndices.push([]);

        for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
            this.boxesByIndices[ix].push(null);

            if ( ix === this.firstX || ix === this.lastX ) {
                if ( iy === this.middleY ) {
                    box = new baltek.rules.Box(this.engine, ix , iy);
                    box.canHostBall = true;
                    box.canHostFootballer = false;
                    this.boxesByIndices[ix][iy] = box;
                }
            } else {
                box = new baltek.rules.Box(this.engine, ix , iy);
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

baltek.rules.Field.prototype.initBallAndTeamsBoxes = function(){

    // First: reset all boxes, from field, ball and teams

    var box = null;
    var ix = 0;
    var iy = 0;
    for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
        for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
            box = this.boxesByIndices[ix][iy];
            if ( box !== null ) {
                box.footballers[this.engine.activeTeam.teamIndex] = null;
                box.footballers[this.engine.passiveTeam.teamIndex] = null;
            }
        }
    }

    this.engine.ball.box = null;

    var n = 0;
    var i = 0;

    n = this.engine.activeTeam.footballers.length;
    for ( i=0; i<n; i++) {
        this.engine.activeTeam.footballers[i].box = null;
    }
    n = this.engine.passiveTeam.footballers.length;
    for ( i=0; i<n; i++) {
        this.engine.passiveTeam.footballers[i].box = null;
    }

    // Second: set boxes for the active team

    var activeIndex = this.engine.activeTeam.teamIndex;
    var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
    var activeDirectionX = 1 - 2*activeIndex

    this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setBall(this.engine.ball);

    // Third: set boxes for the passive team

    this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer3);
    this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer2t);
    this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer2b);
    this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer1t);
    this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer1m);
    this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer1b);

    var passiveIndex = this.engine.passiveTeam.teamIndex;
    var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
    var passiveDirectionX = 1 - 2*passiveIndex

    this.boxesByIndices[passiveOriginX + (this.TSS - 1)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer3);
    this.boxesByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer2t);
    this.boxesByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer2b);
    this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer1t);
    this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer1m);
    this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer1b);
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Footballer = function(team, force){
    this.$init(team, force);
};

baltek.utils.inherit(baltek.rules.Footballer, Object);

baltek.rules.Footballer.prototype.$init = function(team, force){
    this.team = team;
    this.force = force;
    this.box = null;
    this.canKick = false;
    this.canRun = false;
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Team = function(teamIndex){
    this.$init(teamIndex);
};

baltek.utils.inherit(baltek.rules.Team, Object);

baltek.rules.Team.prototype.$init = function(teamIndex){
    this.teamIndex = teamIndex ;
    this.goalBox = null; // the box to be defended by the team
    this.score = 0;
    this.canSprint = false;
    this.haveGoaled = false;
    this.credit = 0;

    // Populate the team
    this.footballer3 = new baltek.rules.Footballer(this, 3);  // captain
    this.footballer2t = new baltek.rules.Footballer(this, 2); // @ top
    this.footballer2b = new baltek.rules.Footballer(this, 2); // @ bottom
    this.footballer1t = new baltek.rules.Footballer(this, 1); // @ top
    this.footballer1m = new baltek.rules.Footballer(this, 1); // @ middle
    this.footballer1b = new baltek.rules.Footballer(this, 1); // @ bottom

    this.footballers = [];
    this.footballers.push(this.footballer3);
    this.footballers.push(this.footballer2t);
    this.footballers.push(this.footballer2b);
    this.footballers.push(this.footballer1t);
    this.footballers.push(this.footballer1m);
    this.footballers.push(this.footballer1b);
}

baltek.rules.Team.prototype.initFootballerCapabilities = function(){
    var i = 0;
    var n = this.footballers.length;
    for ( i=0; i<n; i++ ) {
        this.footballers[i].canKick = true;
        this.footballers[i].canRun = true;
    }
}
///////////////////////////////////////////////////////////////////////////////
