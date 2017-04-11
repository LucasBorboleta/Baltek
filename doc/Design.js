"use strict";
///////////////////////////////////////////////////////////////////////////////
// This file does not contain production code.
// This files just helps thinking about the design.

// Study of abstract interaction between the RulesEngine and the two Players.
// The GUI aspect is not considered here.

///////////////////////////////////////////////////////////////////////////////
// Triggered by the Presenter

var bluePlayer = new Baltek.HumanPlayer();
var redPlayer = new Baltek.AiPlayer();
var redPlayer = new Baltek.RemotePlayer(); // Also possible

var rulesEngine = new Baltek.RulesEngine();

rulesEngine.connectBluePlayer(bluePlayer);
rulesEngine.connectBluePlayer(redPlayer);

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
    this.goalDestination = null;
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
    this.lastX = this.nx-1;
    this.middleX = Math.round((this.firstX + this.lastX)/2);

    this.firstY = 0;
    this.lastY = this.ny-1;
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

    var agix =  this.boxesByIndices[activeOriginX + (2*this.ns + 1)*activeDirectionX;
    var agiy = this.middleY;
    this.engine.activeTeam.goalDestination = this.boxesByIndices[agix][agiy] ;

    var passiveIndex = this.engine.passiveTeam.teamIndex;
    var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
    var passiveDirectionX = 1 - 2*passiveIndex

    var pgix =  this.boxesByIndices[passiveOriginX + (2*this.ns + 1)*passiveDirectionX;
    var pgiy = this.middleY;
    this.engine.passiveTeam.goalDestination = this.boxesByIndices[pgix][pgiy] ;
}

Baltek.RulesEngine.Field.prototype.initPositions = function(){
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
    assert ( footballer.teamIndex === this.engine.activeTeam.teamIndex )

    if ( this.footballers[footballer.teamIndex] !== footballer ) {
        assert ( this.footballers[footballer.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.teamIndex] = null;
        }
        this.footballers[footballer.teamIndex] = footballer;
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
    assert ( footballer.teamIndex === this.engine.passiveTeam.teamIndex )

    if ( this.footballers[footballer.teamIndex] !== footballer ) {
        assert ( this.footballers[footballer.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.teamIndex] = null;
        }
        this.footballers[footballer.teamIndex] = footballer;
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

    this.field = new Baltek.RulesEngine.Field(this);
    this.ball = new Baltek.RulesEngine.Ball();

    var BLUE_INDEX = 0;
    var RED_INDEX = 1;
    this.blueTeam = new Baltek.RulesEngine.Team(this, BLUE_INDEX);
    this.redTeam = new Baltek.RulesEngine.Team(this, RED_INDEX);

    this.activeTeam = this.blueTeam;
    this.passiveTeam = this.redTeam;
}

Baltek.RulesEngine.prototype.connectBluePlayer = function(bluePlayer){
    this.blueTeam.player = bluePlayer;
}

Baltek.RulesEngine.prototype.connectRedPlayer = function(redPlayer){
    this.redTeam.player = redPlayer;
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
    this.activeTeam = this.blueTeam;
    this.passiveTeam = this.redTeam;

    this.activeTeam.score = 0;
    this.passiveTeam.score = 0;

    this.roundInit();
    this.match.isActive = true;
}

Baltek.RulesEngine.prototype.roundInit = function(){
    this.activeTeam.canSprint = true;
    this.passiveTeam.canSprint = true;

    this.activeTeam.haveGoaled = false;
    this.passiveTeam.haveGoaled = false;

    this.field.initPositions();

    this.turnInit();
    this.round.isActive = true;
}

Baltek.RulesEngine.prototype.turnInit = function(){
    var CREDIT_MAX = 3;
    this.activeTeam.credit = CREDIT_MAX;
    this.passiveTeam.credit = 0;

    this.moveInit();
    this.turn.isActive = true;
}

Baltek.RulesEngine.prototype.moveInit = function(){
    this.move.cost = 0;

    this.move.sourceIsSelected = false;
    this.move.sources = null;
    this.move.selectedSource = null;

    this.move.kindIsSelected = false;
    this.move.kinds = null;
    this.move.selectedKind = null;

    this.move.destinationIsSelected = false;
    this.move.destinations = null;
    this.move.selectedDestination = null;

    this.move.isActive = true;
}

Baltek.RulesEngine.prototype.matchUpdate = function(){
    if ( this.match.isActive ) {
        this.roundUpdate();

        if ( ! this.round.isActive ) {

            if ( this.activeTeam.haveGoaled ) {
                this.activeTeam.score += 1

                var SCORE_MAX = 2;
                if ( this.activeTeam.score >= SCORE_MAX or this.passiveTeam.score >= SCORE_MAX ) {
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

        if ( this.move.sourceIsSelected ) {

            if ( this.move.kindIsSelected ) {

                if ( this.move.destinationIsSelected ) {
                    this.move.isActive = false;

                    this.activeTeam.credit -= this.move.cost;

                    if (this.move.selectedDestination === this.activeTeam.goalDestination ) {
                        this.activeTeam.haveGoaled = true;
                    }

                } else {
                    // this.move.destinationIsSelected === false
                    this.moveFindDestinations();
                    // notify the player of the activeTeam

                }

            } else {
                // this.move.kindIsSelected === false
                this.moveFindKinds();
                // notify the player of the activeTeam

            }
        } else {
            // this.move.sourceIsSelected === false
            this.moveFindSources();
            // notify the player of the activeTeam

        }
    }
}

Baltek.RulesEngine.prototype.moveSelectSource = function(source){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive ) {
        if ( ! this.move.sourceIsSelected) {
            if ( Baltek.Utils.hasValue(this.move.sources, source) ) {
                this.move.selectedSource = source;
                this.move.sourceIsSelected = true;
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveUnselectSource = function(source){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceIsSelected ) {
        this.move.cost = 0;

        this.move.sourceIsSelected = false;
        this.move.sources = null;
        this.move.selectedSource = null;

        this.move.kindIsSelected = false;
        this.move.kinds = null;
        this.move.selectedKind = null;

        this.move.destinationIsSelected = false;
        this.move.destinations = null;
        this.move.selectedDestination = null;

        this.matchUpdate();
    }
}

Baltek.RulesEngine.prototype.moveUnselectKind = function(source){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceIsSelected && this.move.kindIsSelected ) {
        this.move.cost = 0;

        this.move.kindIsSelected = false;
        this.move.kinds = null;
        this.move.selectedKind = null;

        this.move.destinationIsSelected = false;
        this.move.destinations = null;
        this.move.selectedDestination = null;

        this.matchUpdate();
    }
}

Baltek.RulesEngine.prototype.moveSelectKind = function(kind){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceIsSelected ) {
        if ( ! this.move.kindIsSelected ) {
            if ( Baltek.Utils.hasValue(this.move.kinds, kind) ) {
                this.move.selectedKind = kind;
                this.move.kindIsSelected = true;
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveSelectDestination = function(destination){
    // Triggered by the player of the activeTeam

    if ( this.move.isActive && this.move.sourceIsSelected && this.move.kindIsSelected ) {
        if ( ! this.move.destinationIsSelected ) {
            if ( Baltek.Utils.hasValue(this.move.destinations, destination) ) {
                this.move.selectedDestination = destination;
                this.move.destinationIsSelected = true;
                // Compute the cost of the move
                this.move.cost = ... ;
                // Move ball or footballer
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindSources = function(){
    if ( this.move.isActive ) {
        if ( ! this.move.sourceIsSelected) {
            this.move.sources = [] ;
            var n = this.activeTeam.footballers.length;
            var i;
            for (i=0; i<n; i++) {
                this.move.sources.push(this.activeTeam.footballers[i].box);
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindKinds = function(){
    //TODO: move elsewhere
    var MOVE_KIND_RUN = 0;
    var MOVE_KIND_SPRINT = 1;
    var MOVE_KIND_KICK = 2;

    if ( this.move.isActive && this.move.sourceIsSelected ) {
        if ( ! this.move.kindIsSelected ) {

            this.move.kinds = [] ;

            var activeFootballer = this.selectedSource.footballers[this.engine.activeTeam.teamIndex];
            var activeFootballerHasBall = ( this.selectedSource.ball !== null );

            //TODO: add cost and credit concern

            if ( activeFootballer.canRun ) {
                this.move.kinds.push(MOVE_KIND_RUN);

                if ( this.activeTeam.canSprint ) {
                    this.move.kinds.push(MOVE_KIND_SPRINT);
                }
            }

            if ( activeFootballer.canKick && activeFootballerHasBall ) {
                this.move.kinds.push(MOVE_KIND_KICK);
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindDestinations = function(){
    if ( this.move.isActive && this.move.sourceIsSelected && this.move.kindIsSelected ) {
        if ( ! this.move.destinationIsSelected ) {
            this.move.destinations = [] ;

            //TODO: add cost and credit concern

            if ( this.move.selectedKind === MOVE_KIND_KICK ) {
                var KICK_MOVE_MAX = 2;
                var ix;
                var iy;
                var box;
                for ( ix=this.selectedSource.ix - KICK_MOVE_MAX; ix <= this.selectedSource.ix + KICK_MOVE_MAX; ix++ = {
                    if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                        for ( iy=this.selectedSource.iy - KICK_MOVE_MAX; iy <= this.selectedSource.iy + KICK_MOVE_MAX; iy++ = {
                            if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                                box = this.field.boxes[ix][iy];
                                if ( box !== null && box != this.selectedSource ) {
                                    this.move.destinations.push(box);
                                }
                            }
                        }
                    }
                }
            } else if ( this.move.selectedKind === MOVE_KIND_RUN ) {
                var RUN_MOVE_MAX = 1;
                var ix;
                var iy;
                var box;
                for ( ix=this.selectedSource.ix - RUN_MOVE_MAX; ix <= this.selectedSource.ix + RUN_MOVE_MAX; ix++ = {
                    if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                        for ( iy=this.selectedSource.iy - RUN_MOVE_MAX; iy <= this.selectedSource.iy + RUN_MOVE_MAX; iy++ = {
                            if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                                box = this.field.boxes[ix][iy];
                                if ( box !== null && box != this.selectedSource ) {
                                    if ( box.footballers[this.activeTeam.teamIndex] === null ) {
                                        this.move.destinations.push(box);
                                    }
                                }
                            }
                        }
                    }
                }
            } else if ( this.move.selectedKind === MOVE_KIND_SPRINT ) {
                //TODO: remove boxes that are reachable using just MOVE_KIND_RUN
                var SPRINT_MOVE_MAX = 2;
                var ix;
                var iy;
                var box;
                for ( ix=this.selectedSource.ix - SPRINT_MOVE_MAX; ix <= this.selectedSource.ix + SPRINT_MOVE_MAX; ix++ = {
                    if ( ix >= this.field.firstX && ix <= this.field.lastX) {
                        for ( iy=this.selectedSource.iy - SPRINT_MOVE_MAX; iy <= this.selectedSource.iy + SPRINT_MOVE_MAX; iy++ = {
                            if ( iy >= this.field.firstY && iy <= this.field.lastY) {
                                box = this.field.boxes[ix][iy];
                                if ( box !== null && box != this.selectedSource ) {
                                    if ( box.footballers[this.activeTeam.teamIndex] === null ) {
                                        this.move.destinations.push(box);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
