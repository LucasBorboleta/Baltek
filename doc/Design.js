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

//TODO: implement blueTeam and redTeam inside RulesEngine
//TODO: bluePlayer controls the blueTeam
//TODO: redPlayer controls the redTeam
//TODO: this.blueTeam.score
//TODO: this.blueTeam.footballers
//TODO: this.blueTeam.goalBox
//TODO: this.blueTeam.player = bluePlayer
//TODO: this.activeTeam = this.blueTeam
//TODO: this.passiveTeam


// Init the match
rulesEngine.matchInit();

// Start the interactions
rulesEngine.update();

///////////////////////////////////////////////////////////////////////////////

Baltek.RulesEngine.prototype.matchInit = function(){
    // ...

    // The blue player always starts the first trun
    this.activePlayer = this.bluePlayer;
    this.passivePlayer = this.redPlayer;
    this.match.blueScore = 0;
    this.match.redScore = 0;
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
}

Baltek.RulesEngine.prototype.selectSource = function(source){
    // check source in this.move.sources
    this.move.selectedSource = source;
    this.move.sourceIsSelected = true;
    this.update();
}

Baltek.RulesEngine.prototype.moveFindKinds = function(){
    // ... and update this.move.kinds
}

Baltek.RulesEngine.prototype.selectKind = function(kind){
    // check kind in this.move.kinds
    this.move.selectedKind = kind;
    this.move.kindIsSelected = true;
    this.update();
}

Baltek.RulesEngine.prototype.moveFindDestinations = function(){
    // ... and update this.move.destinations
}

Baltek.RulesEngine.prototype.selectDestination = function(destination){
    // check destination in this.move.destinations
    this.move.selectedDestination = destination;
    this.move.destinationIsSelected = true;
    this.update();
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
                                if ( this.round.goal ) {
                                    this.round.isActive = false;

                                    // update the scores

                                    // check the scores
                                    var SCORE_MAX = 2;

                                    if ( this.match.blueScore >= SCORE_MAX or this.match.redScore >= SCORE_MAX ) {
                                        this.match.isActive = false;
                                    }
                                }

                            } else {
                                // this.move.destinationIsSelected === false
                                this.moveFindDestinations();
                                // notify the activePlayer
                            }

                        } else {
                            // this.move.kindIsSelected === false
                            this.moveFindKinds();
                            // notify the activePlayer
                        }
                    } else {
                        // this.move.sourceIsSelected === false
                        this.moveFindSources();
                        // notify the activePlayer
                    }

                } else {
                    // this.move.isActive === false
                    this.moveInit();
                }

            } else {
                // this.turn.isActive === false
                this.switchActiveAndPassivePlayers();
                this.turnInit();
            }

        } else {
            // this.round.isActive === false
            this.switchActiveAndPassivePlayers();
            this.roundInit();
        }

    } else {
        // this.match.isActive === false
    }
}

Baltek.RulesEngine.prototype.switchActiveAndPassivePlayers = function(){
    var oldActivePlayer = this.activePlayer;
    var oldPassivePlayer = this.passivePlayer;
    this.activePlayer = this.oldPassivePlayer;
    this.passivePlayer = this.oldActivePlayer;
}

Baltek.RulesEngine.prototype.setActivePlayer = function(activePlayer){
    if ( activePlayer !== this.activePlayer ) {
        this.switchActiveAndPassivePlayers();
    }
}

Baltek.RulesEngine.prototype.setPassivePlayer = function(passivePlayer){
    if ( passivePlayer !== this.passivePlayer ) {
        this.switchActiveAndPassivePlayers();
    }
}

///////////////////////////////////////////////////////////////////////////////
