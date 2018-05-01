# TEST PLAN

## Introduction 

This document prescribes global tests that have to be executed manually.

The tester is expected to know the rules of BALTEK.

## Navigation history

1. The user is in the "game" panel. The user moves the ball and a footballer. The user enters the "settings" panel and changes some options. The user moves back to the "game" panel. The user sees the ball and the footballers at the positions left before entering the "settings" panel.
2. Idem when the user enters the "help" panel and moves back to the "game" panel.
3. The user is in the "game" panel. The user enters the "help" panel and selects one of "rules"/"guide"/"about" item. The user moves back to the "game" panel. The user enters again the "help" panel and sees the previously selected item.

## Settings

1. The user loads BALTEK.  The labels must appear either in the user locale language or in the default language which is English.
2. The user changes the language in the "settings" panel, then all labels and text must appear in the selected language.
3. The user changes the "coordinates" display in the "settings" panel, then the effect must be visible when the user moves back to the "game" panel.
4. The user changes the "debug" display in the "settings" panel, then the debug zone must be displayed/masked immediately in the "settings" panel, and also in the "game" and "help" when they are next visited.

## Debug messages

Here by hypothesis, the debug zone is displayed.

1. In the "game" panel the "debug" zone must display the mouse coordinates.
2. In the "game" panel, when the user moves the mouse over the field, then the coordinates must be continuously updated.The coordinates "(0, 0)" must correspond to the left and upper corner of the field.
3. The debug messages must be numbered with decreasing number from top to bottom.
4. The user presses the "clear messages" button, then the displayed messages are removed.


## Quick blue scenario

1. The user starts a new game.
2. The blue player moves as quickly as possible the ball in order to shoot at the red goal.
3. The blue player uses the sprints bonus.
4. The red player does some moves, but without trying any defense to block the blue strategy.
5. When the blue player moves the ball in the red goal, and after confirmation of  the move, the score must be updated and the footballers must be moved at their kick-off positions.
6. Repeat the same sequence. It must finish with a score of 2 goals for the blue player and 0 goal for the red player.
7. BALTEK must propose to restart an new game. When the user presses "new game", then the scores are reset and the footballers must be moved at their kick-off positions.

## Quick red scenario

The is the symmetric of the blue scenario, but applied from to the red team.

## Quick blue/red scenario

This is a variant of the about quick scenario where the blue player scored 2 goals and the red player scored  1 goal.

## Undo feature

The active player performs a few moves without pressing "OK". The user presses "Undo". The state of the game returns to the state at the beginning of the active turn.

## Sprint

The sprint bonus must be displayed when staring a new game and after each kick-off.

The sprint bonus must not be provide more than once between two kick-offs.

## Credits

The available credits must be displayed according to the rules.

## Footballer marks

The "can run" and "can kick" (if the credits are available) must be displayed accordingly to the rules: at most one kick and one run per footballer during a given turn.

## Yellow borders

The yellow borders must be displayed accordingly to the rules.

Each section of the rules text must be tested at least once.








