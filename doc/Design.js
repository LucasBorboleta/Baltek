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

Baltek.RulesEngine.prototype.matchInit = function(){
    // ...

    // The blue player always starts the first trun
    this.activePlayer = this.bluePlayer;
    this.passivePlayer = this.redPlayer;
    this.blueScore = 0;
    this.redScore = 0;
    this.match.isActive = true;
    this.roundInit();
}

Baltek.RulesEngine.prototype.roundInit = function(){
    // Prepare the footballers and the ball for the kickoff

    this.goal = false;
    this.round.isActive = true;
    this.turnInit();
}

Baltek.RulesEngine.prototype.turnInit = function(){
    this.turn.credit = CREDIT_MAX;
    this.turn.isActive = true;
}

Baltek.RulesEngine.prototype.moveInit = function(){
    this.move.isActive = true;
}

Baltek.RulesEngine.prototype.update = function(){
    var SCORE_MAX = 2;
    var CREDIT_MAX = 3;

    if ( this.blueScore >= SCORE_MAX or this.redScore >= SCORE_MAX ) {
        this.match.isActive = false;
    }

    if ( this.goal !== null ) {
        this.round.isActive = false;
    }

    if ( this.turn.credit <= 0 ) {
        this.turn.isActive = false;
    }

    if ( this.match.isActive ) {

        if ( this.round.isActive ) {

            if ( this.turn.isActive ) {

                if ( this.move.isActive ) {
                    // Update the possible moves, broken in three steps
                    // Notify the activePlayer

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

Baltek.RulesEngine.prototype.requestMove = function(player){
    var move = new Baltek.RulesEngine.Move();
    // etc
    player.buildMove(move);
}
///////////////////////////////////////////////////////////////////////////////
Baltek.Player.prototype.playTurn = function(){


}

Baltek.Player.prototype.buildMove = function(move){
    var selectableSourceBoxes = move.getSelectableSourcesBoxes();
    var sourceBox = null;
    // TODO: decision of human or AI.
    move.setSourceBox(sourceBox);

    var selectableMoveKinds = move.getSelectableMoveKinds();
    var moveKind = null;
    // TODO: decision of human or AI.
    move.setMoveKind(moveKind);

    var selectableDestinationBoxes = move.getSelectableDestinationBoxes();
    var destinationBox = null;
    // TODO: decision of human or AI.
    move.setDestinationBox(destinationBox);

    move.commit();
}

///////////////////////////////////////////////////////////////////////////////
