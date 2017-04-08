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
    this.footballer2x = new Baltek.RulesEngine.Footballer(this, 2);
    this.footballer2y = new Baltek.RulesEngine.Footballer(this, 2);
    this.footballer1x = new Baltek.RulesEngine.Footballer(this, 1);
    this.footballer1y = new Baltek.RulesEngine.Footballer(this, 1);
    this.footballer1z = new Baltek.RulesEngine.Footballer(this, 1);

    this.footballers = [];
    this.footballers.push(this.footballer3);
    this.footballers.push(this.footballer2x);
    this.footballers.push(this.footballer2y);
    this.footballers.push(this.footballer1x);
    this.footballers.push(this.footballer1y);
    this.footballers.push(this.footballer1z);
}

Baltek.RulesEngine.Team.prototype.exitFromField = function(){
    var n = this.footballers.length;
    var i;
    for (i=0; i<n; i++) {
        this.footballers[i].exitFromField();
    }
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.Field.prototype.$init = function(engine){
    this.engine = engine;
    this.ny = 5 ;
    this.nx = 2*( this.ny + 1 ) ;

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
}

Baltek.RulesEngine.Field.prototype.initPositions = function(engine){
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
    this.engine.activeTeam.footballer3.moveToBox(activeOriginX + 5*activeDirectionX, this.middleY);
    this.engine.activeTeam.footballer2x.moveToBox(activeOriginX + 5*activeDirectionX, this.firstY);
    this.engine.activeTeam.footballer2y.moveToBox(activeOriginX + 5*activeDirectionX, this.lastY);
    this.engine.activeTeam.footballer1x.moveToBox(activeOriginX + 3*activeDirectionX, this.firstY);
    this.engine.activeTeam.footballer1y.moveToBox(activeOriginX + 3*activeDirectionX, this.middleY);
    this.engine.activeTeam.footballer1z.moveToBox(activeOriginX + 3*activeDirectionX, this.lastY);

    //TODO: move elsewhere
    this.engine.activeTeam.goalDestination = this.boxesByIndices[activeOriginX + 11*activeDirectionX][this.middleY];

    var passiveIndex = this.engine.passiveTeam.teamIndex;
    var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
    var passiveDirectionX = 1 - 2*passiveIndex
    this.engine.passiveTeam.footballer3.moveToBox(passiveOriginX + 5*passiveDirectionX, this.middleY);
    this.engine.passiveTeam.footballer2x.moveToBox(passiveOriginX + 4*passiveDirectionX, this.firstY);
    this.engine.passiveTeam.footballer2y.moveToBox(passiveOriginX + 5*passiveDirectionX, this.lastY);
    this.engine.passiveTeam.footballer1x.moveToBox(passiveOriginX + 3*passiveDirectionX, this.firstY);
    this.engine.passiveTeam.footballer1y.moveToBox(passiveOriginX + 3*passiveDirectionX, this.middleY);
    this.engine.passiveTeam.footballer1z.moveToBox(passiveOriginX + 3*passiveDirectionX, this.lastY);

    //TODO: move elsewhere
    this.engine.passiveTeam.goalDestination = this.boxesByIndices[passiveOriginX + 11*passiveDirectionX][this.middleY];
}

///////////////////////////////////////////////////////////////////////////////
Baltek.RulesEngine.box.prototype.$init = function(engine, ix, iy){
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

Baltek.RulesEngine.box.prototype.exitFromField = function(footballer){
    if ( footballer !== null && footballer.box === this ) {
        footballer.box.footballers[footballer.teamIndex] = null;
    }
}

Baltek.RulesEngine.box.prototype.setFootballer = function(footballer){
    if ( footballer.box !== null ) {
        footballer.box.footballers[footballer.teamIndex] = null;
    }
    this.footballers[footballer.teamIndex] = footballer;
    footballer.box = this;
}

Baltek.RulesEngine.box.prototype.getActiveFootballer = function(){
    return this.footballers[this.engine.activeTeam.teamIndex];
}

Baltek.RulesEngine.box.prototype.getPassiveFootballer = function(){
    return this.footballers[this.engine.passiveTeam.teamIndex];
}
///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.prototype.$init = function(){
    this.field = new Baltek.RulesEngine.Field(this);

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
                this.matchUpdate();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindSources = function(){
    if ( this.move.isActive ) {
        if ( ! this.move.sourceIsSelected) {
            this.move.sources = ... ;
        }
    }
}

Baltek.RulesEngine.prototype.moveFindKinds = function(){
    if ( this.move.isActive && this.move.sourceIsSelected ) {
        if ( ! this.move.kindIsSelected ) {
            this.move.kinds = ... ;
        }
    }
}

Baltek.RulesEngine.prototype.moveFindDestinations = function(){
    if ( this.move.isActive && this.move.sourceIsSelected && this.move.kindIsSelected ) {
        if ( ! this.move.destinationIsSelected ) {
            this.move.destinations = ... ;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
