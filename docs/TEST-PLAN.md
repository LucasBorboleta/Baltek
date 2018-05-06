# TEST PLAN

## Introduction 

This document prescribes global tests that have to be executed manually.

The tester is expected to know the rules of BALTEK.

Some prescriptions are detailed as scenarios using pre/post-conditions and actions. Some other ones are just briefly phrased in plain English.

## Navigation history

1. Entering **settings** and moving back:

   - Pre-condition: The user is in the **game** panel and plays a new game. 

   - Action: The user moves the ball and a footballer. 
   - Action: The user enters the **settings** panel and changes some options. 
   - Action: The user moves back to the **game** panel. 
   - Post-condition: The ball and the footballers are at the positions left before entering the **settings** panel.

2. Entering **help** and moving back:

   - Pre-condition: The user is in the **game** panel. 

   - Action: The user moves the ball and a footballer. 
   - Action: The user enters the **help** panel and changes some options. 
   - Action: The user moves back to the **game** panel. 
   - Post-condition: The ball and the footballers are at the positions left before entering the **settings** panel.

3. Re-entering the **help** panel:

   - Pre-condition: The user is in the **game** panel. 
   - Action: The user enters the **help** panel.
   - Action: The user selects one of **rules**/**guide**/**about** item; says **$i**
   - Action: The user moves back to the **game** panel. 
   - Action: The user enters again the **help** panel.
   - Post-condition: The user sees the previously selected **$i** item.

## Settings

1. Default language:

   1. Pre-condition: BALTEK not loaded.
   2. Action: The user loads BALTEK.  
   3. Post-condition: The user sees the labels in the user locale language or in the default language, which is English.

2. Changing language:

   - Action: The user changes the language in the **settings** panel.
   - Post-condition: The user sees all labels and text in the selected language.
   - Action: The user moves back to the **game** panel. 
   - Post-condition: The user sees all labels and text in the selected language.
   - Action: The user enters the **help** panel.
   - Post-condition: The user sees all labels and text in the selected language.

3. Displaying coordinates:

   1. Pre-condition: The user is in the **game** panel. 
   2. Post-condition: The user does not see the coordinates.
   3. Action: The user enters the **settings** panel.
   4. Action: The user changes the coordinates display.
   5. Action: The user moves back to the **game** panel. 
   6. Post-condition: The user sees the coordinates.
   7. Action: The user re-enters the **settings** panel.
   8. Action: The user changes back the coordinates display.
   9. Action: The user moves back to the **game** panel. 
   10. Post-condition: The user does not see the coordinates.

4. Displaying debug zone:

   - Pre-condition: The user does not see the debug zone.
   - Action: The user changes the **debug** display in the **settings** panel.
   - Post-condition: The user sees the debug zone.
   - Action: The user moves back to the **game** panel. 
   - Post-condition: The user sees the debug zone.
   - Action: The user enters the help panel.
   - Post-condition: The user sees the debug zone.
   - Action: The user changes again the **debug** display in the **settings** panel.
   - Post-condition: The user does not see the debug zone.
   - Action: The user moves back to the **game** panel. 
   - Post-condition: The user does not see the debug zone.
   - Action: The user enters the **help** panel.
   - Post-condition: The user does not see the debug zone.

## Debug messages

Pre-condition: The user sees the debug zone.

Pre-condition: The user sees the **game** panel.

1. Mouse coordinates:

  - Post-condition: The user sees the mouse coordinates in the debug zone.
  - Action: The user moves the mouse around the field.
  - Post-condition: The mouse coordinates are instantaneously and continuously updated.
  - Action: The user moves to mouse to the left and upper corner of the field.
  - Post-condition: The user sees the mouse coordinates as **(0, 0)**.

2. Message numbering:

  - Action: The user plays a few moves.
  - Post-conditions: The user sees a few debug messages.
  - Post-conditions: The user sees the debug messages numbered with decreasing number from top to bottom.

2. Message clearing:

  - Action: The user plays a few moves.
  - Post-conditions: The user sees a few debug messages.
  - Action: The user presses the **clear messages** button.
  - Post-conditions: The user does not see debug messages.

## Quick blue scenario

- Action: The user starts a new game.
- Action: The blue player moves as quickly as possible the ball in order to shoot at the red goal.
- Action: The blue player uses the sprints bonus.
- Action: The red player does some moves, but without trying any defense to block the blue strategy.
- Action: The blue player moves the ball in the red goal, and confirms  the move
- Post-condition: The score has been updated.
- Post-condition: The footballers have been moved at their kick-off positions.
- Action: The two players repeat the same sequence. 
- Post-condition: The score are 2 goals for the blue player and 0 goal for the red player.
- Post-condition: The option to restart a new game is proposed.
- Action: The user presses **new game**, 
- Post-condition: The scores are reset.
- Post-condition: The footballers are moved at their kick-off positions.

## Quick red scenario

The is the symmetric of the blue scenario, but applied from the red team side.

## Quick blue/red scenario

This is a variant of the quick scenario where the blue player scored 2 goals and the red player scored  1 goal.

## Undo feature

* Pre-condition: The active player has some credits of action.
* Pre-condition: The active player has not yet perform any action.
* Action: The active player performs a few moves without pressing **OK**. 
* Action: The user presses **Undo**. 
* Post-condition: The state of the game has return to the state corresponding to the beginning of the active turn.

## Sprint

The sprint bonus must be displayed when starting a new game and after each kick-off.

The sprint bonus must not be provided more than once between two kick-offs.


## Credits

The available credits of action must be displayed according to the rules.

## Footballer marks

The **can run** and **can kick** must be displayed accordingly to the rules: at most one kick and one run per footballer during a given turn.


## Yellow borders

The yellow borders must be displayed accordingly to the rules.

Each section of the rules text must be tested at least once.

## Two synchronized web browsers

Test this BALTEK mode after launching the simple HTTP server thanks to [test-game-using-http.py](../tools/test-game-using-http.py) in a terminal.










