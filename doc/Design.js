"use strict";
///////////////////////////////////////////////////////////////////////////////
// This file does not contain production code.
// This files just helps thinking about the design.

///////////////////////////////////////////////////////////////////////////////
// Study of abstract interaction between the RulesEngine and the player.
// The GUI aspect is not considered here.

// Initialization sequence
var rulesEngine = new Baltek.RulesEngine();
var bluePlayer = new Baltek.Player();
var redPlayer = new Baltek.Player();

rulesEngine.setBluePlayer(bluePlayer);
rulesEngine.setBluePlayer(redPlayer);

// Other settings ...

// Start the interactions
rulesEngine.run();

// Let us concentrate on the blue player

Baltek.RulesEngine.prototype.requestMove = function(player){
    var move = new Baltek.RulesEngine.Move();
    // etc
    player.buildMove(move);
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
