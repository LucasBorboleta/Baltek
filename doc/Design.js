"use strict";
///////////////////////////////////////////////////////////////////////////////
// This file does not contain production code.
// This files just helps thinking about the design.

///////////////////////////////////////////////////////////////////////////////
// Study of abstract interaction between the RulesEngine and the two Players.
// The GUI aspect is not considered here.

// Create the two Players
// All kinds of concrete class inherits the class Baltek.Player
var bluePlayer = new Baltek.HumanPlayer();
var redPlayer = new Baltek.AiPlayer();
var redPlayer = new Baltek.RemotePlayer(); // Also possible
// etc

// Create a new RulesEngine for each new match
var rulesEngine = new Baltek.RulesEngine();

// Connect the two Players on the RulesEngine
rulesEngine.connectBluePlayer(bluePlayer);
rulesEngine.connectBluePlayer(redPlayer);

// Init the match
rulesEngine.matchInit();

// Start the interactions
rulesEngine.update();

///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.Team.prototype.$init = function(){
    this.player = null;
    this.score = 0;
    this.footballers = null;
    this.goalDestination = null;
}

///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.prototype.connectBluePlayer = function(bluePlayer){
    this.blueTeam.player = bluePlayer;
}

Baltek.RulesEngine.prototype.connectRedPlayer = function(redPlayer){
    this.redTeam.player = redPlayer;
}

Baltek.RulesEngine.prototype.matchInit = function(){
    // ...

    // The blue player always starts the first trun
    this.activeTeam = this.blueTeam;
    this.passiveTeam = this.redTeam;
    this.blueTeam.score = 0;
    this.redTeam.score = 0;
    this.match.isActive = true;
    this.roundInit();
}

Baltek.RulesEngine.prototype.roundInit = function(){
    // Prepare the footballers and the ball for the kickoff

    this.round.goal = false;
    this.round.isActive = true;
    this.turnInit();
}

Baltek.RulesEngine.prototype.turnInit = function(){
    var CREDIT_MAX = 3;
    this.turn.credit = CREDIT_MAX;
    this.turn.isActive = true;
    this.moveInit();
}

Baltek.RulesEngine.prototype.moveInit = function(){
    this.move.isActive = true;
    
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
}

Baltek.RulesEngine.prototype.moveFindSources = function(){
    // ... and update this.move.sources
    this.move.sources = ... ;
}

Baltek.RulesEngine.prototype.moveSelecSource = function(source){
    if ( this.move.isActive ) {
        if ( ! this.move.sourceIsSelected) {
            if ( Baltek.Utils.hasValue(this.move.sources, source) ) {
                this.move.selectedSource = source;
                this.move.sourceIsSelected = true;
                this.update();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindKinds = function(){
    // ... and update this.move.kinds
    this.move.kinds = ... ;
}

Baltek.RulesEngine.prototype.moveSelectKind = function(kind){
    if ( this.move.isActive && this.move.sourceIsSelected ) {
        if ( ! this.move.kindIsSelected ) {
            if ( Baltek.Utils.hasValue(this.move.kinds, kind) ) {
                this.move.selectedKind = kind;
                this.move.kindIsSelected = true;
                this.update();
            }
        }
    }
}

Baltek.RulesEngine.prototype.moveFindDestinations = function(){
    // ... and update this.move.destinations
    this.move.destinations = ... ;
}

Baltek.RulesEngine.prototype.moveSelectDestination = function(destination){
    if ( this.move.isActive && this.move.sourceIsSelected && this.move.kindIsSelected ) {
        if ( ! this.move.destinationIsSelected ) {
            if ( Baltek.Utils.hasValue(this.move.destinations, destination) ) {
                this.move.selectedDestination = destination;
                this.move.destinationIsSelected = true;
                this.update();
            }
        }
    }
}

Baltek.RulesEngine.prototype.update = function(){

    if ( this.match.isActive ) {

        if ( this.round.isActive ) {

            if ( this.turn.isActive ) {

                if ( this.move.isActive ) {

                    if ( this.move.sourceIsSelected ) {

                        if ( this.move.kindIsSelected ) {

                            if ( this.move.destinationIsSelected ) {
                                this.move.isActive = false;

                                // Compute the cost of the move
                                this.turn.credit -= this.move.cost;
                                this.turn.isActive = ( this.turn.credit <= 0 );

                                // Check goal
                                this.round.goal = (this.move.selectedDestination == this.activeTeam.goalDestination)
                                if ( this.round.goal ) {
                                    this.round.isActive = false;

                                    this.activeTeam.score += 1

                                    var SCORE_MAX = 2;

                                    if ( this.activeTeam.score >= SCORE_MAX or this.passiveTeam.score >= SCORE_MAX ) {
                                        this.match.isActive = false;
                                    }
                                }

                            } else {
                                // this.move.destinationIsSelected === false
                                this.moveFindDestinations();
                                // notify the activeTeam
                            }

                        } else {
                            // this.move.kindIsSelected === false
                            this.moveFindKinds();
                            // notify the activeTeam
                        }
                    } else {
                        // this.move.sourceIsSelected === false
                        this.moveFindSources();
                        // notify the activeTeam
                    }

                } else {
                    // this.move.isActive === false
                    this.moveInit();
                }

            } else {
                // this.turn.isActive === false
                this.switchActiveAndPassiveTeams();
                this.turnInit();
            }

        } else {
            // this.round.isActive === false
            this.switchActiveAndPassiveTeams();
            this.roundInit();
        }

    } else {
        // this.match.isActive === false
    }
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

///////////////////////////////////////////////////////////////////////////////
