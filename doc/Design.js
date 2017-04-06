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
rulesEngine.matchUpdate();

///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.Team.prototype.$init = function(){
    this.side = ... ; // Blue or Red
    this.footballers = null;
    this.goalDestination = null;
    this.player = null;
    this.score = 0;
    this.canSprint = false;
    this.haveGoaled = false;
    this.credit = 0;
}

//TODO: Team.prepareFootballers(kickoff);


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

Baltek.RulesEngine.prototype.connectBluePlayer = function(bluePlayer){
    this.blueTeam.player = bluePlayer;
}

Baltek.RulesEngine.prototype.connectRedPlayer = function(redPlayer){
    this.redTeam.player = redPlayer;
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

    var kickoff = true;
    this.activeTeam.prepareFootballers(kickoff);
    this.passiveTeam.prepareFootballers(! kickoff);

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
    // Triggered by a Player
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
    }
}

Baltek.RulesEngine.prototype.moveSelectSource = function(source){
    // Triggered by a Player
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

//TODO: moveUnselectSource
//TODO: moveUnselectKind

Baltek.RulesEngine.prototype.moveSelectKind = function(kind){
    // Triggered by a Player
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
    // Triggered by a Player
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
