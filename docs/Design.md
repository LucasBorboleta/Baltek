# Design of Baltek

## Introduction

This document aims at collecting implementation principles and choices, as well as thoughts for not yet implemented features. Therefore the audience of this document is the interested developers in contributing to _Baltek_ , but not the end-users of _Baltek_.

## Implementation

### CSS

_w3.css_ is used mainly for formatting texts, but not for buttons and selectors.

_normalize.css_ is not directly used, but _w3.css_ uses some extract of _normalize.css_.

### JS

_JavaScript.isSexy_ [](http://javascriptissexy.com/) is a blog on modern JavaScript and modern web application development. A chunk of code is used for implemented OOP inheritance in the _Baltek_ classes._Richard_, the author of the blog, also quotes _Douglas Crockford_.

## General design

_Baltek_ aims at decoupling its modules in order to implement, as easy as possible, the following features or changes:

- The user plays against another player seating in front of the same desktop computer.
- The user plays against an Artificial Intelligence (AI).
- The user plays against a remote player.
- _Baltek_ adapts the visual aspect to either desktop or smart phone.
- The developer decides to use another User Interface (UI) framework.

Let us get inspiration from the **Model View Presenter (MVP)**

> ```ascii
>            +-----------+
>            |   View    |
>            +--+----+---+
>   user events |    ^
>               v    | updates view
>            +--+----+---+
>            | Presenter |
>            +--+---+----+
> updates model |   ^
>               v   | state-change events
>            +--+---+----+
>            |   Model   |
>            +-----------+
> ```

Let us translate such diagram into a table of events:

| Step | View             | Presenter                   | Model                   |
| ---- | ---------------- | --------------------------- | ----------------------- |
| 1    | sends user event |                             |                         |
| 2    |                  | receives user event         |                         |
| 3    |                  | requests model change       |                         |
| 4    |                  |                             | updates model           |
| 5    |                  |                             | send state-change event |
| 6    |                  | receives state-change event |                         |
| 7    |                  | request view change         |                         |
| 8    | updates view     |                             |                         |

The previous objectives implies the following cluster of classes:

### Cluster for the state of game (Model)

These classes represent:

- The boxes of the field: its geometry, the position for the goals.
- The blue and red players: their forces, their positions, their moves in the current turn.
- The position of the ball.
- The score.
- The usage of the sprint bonus for each team.
- The turn: blue team or red team.
- The remaining action points of the active team.

These classes know:

- How to initialize the state of the game.
- How to clone the state the game.
- How to move the players at their initial positions.
- The possible action of the active team: move of each player, move of the ball, reinitialize the players positions.
- How to note the played moves.

### Cluster for the Presenter

These classes manage:

- The overall initialization of the software.
- The coordination between all other clusters.
- The captures of events.

### Cluster for the View

These classes manage the drawing. Nothing else.

### Cluster for the AI

These classes represent a virtual player.

From a given state of the game, the AI provides moves. An advanced AI might also used the previous states of the game in order to provides the next moves.

### Cluster for the remote interaction

These classes are responsible for:

- Initializing the remote connection.
- Transforming local event into remote event, and vice versa.

## The game phases

Hereafter are the phases that are relevant and useful for organizing the software

- 1 match is composed of n >= 1 rounds
- 1 round begins after each kickoff
- 1 round ends after a goal by one player
- 1 round is composed of n >= 1 turns
- 1 turn is devoted to a given player
- 1 turn is composed of n >= 0 moves
- 1 move is the smallest action that a player can decide

## Estimation of the number of possible moves

Let us determine a bound for the possible moves:

- 6 boxes, related to the six footballers are selectable.
- 3 kinds of moves are possible:

  - kick
  - run
  - sprint

- For a kick `(5*5 - 1) = 24` destination boxes are possible.

- For a run `(3*3 - 1) = 8` destination boxes are possible.

- For a sprint `( (5*5 - 1) - (3*3 -1) = (24 - 8) = 16` destination boxes are possible.

- For a move, `6*(24 + 8 + 16) = 6*48 = 288` moves are possible, or maybe less, but never more.

## Ideas for cutting responsibilities amongst the classes

- One entity PlayerBlue
- One entity PlayerRed
- One entity RulesEngine
- The entities Players can query the RulesEngine
- The RulesEngine notifies the Players
- Each Player provides its move, or decision to end its turn to the RulesEngine

- The entity Presenter updates the Screen

- The RulesEngine notifies the Presenter of changes (moves of the Players)

- The Mouse notifies the Presenter, which in turn, updates the active Player

- Kinds of notifications of the RulesEgine towards the Players, and maybe the Presenter:

  - start/end of round
  - start/end of turn
  - start/end of move
  - etc.

- A move can be seen as a triple :

  - Source box: it is a box hosting a footballer from the team of the active Player
  - Kind of move:

    - run of the footballer
    - sprint of the footballer is the "sprint bonus" has not yet been used
    - kick of the ball if the ball is in the box, and if possible dribble can be paid

  - Destination box: either for the footballer (run or sprint) or for the ball (kick)

- The RulesEngine can help the Player for deciding its move using the following sequence:

  - Player requests the RulesEngine for a new Move entity.
  - Player queries the RulesEngine for the selectable source boxes
  - Player selects one item from the selectable sources, and records that choice within the Move entity
  - Player queries the RulesEngine for the selectable kinds of move related to the chosen source
  - Player selects one item from the selectable kinds, and records that choice within the Move entity
  - Player queries the RulesEngine for the selectable destinations of move related to the chosen source and kind of move.
  - Player selects one item from the selectable destinations, and records that choice within the Move entity
  - Player either confirms/commits its move or cancels it.
  - Player should also have the ability to unselect a chosen at one of the three steps: select/unselect the source of move; select/unselect the kind of move; select/unselect the destination of the move.
  - Hint-1: let us imagine an Artificial Intelligence that queries the RulesEngine, makes its own assessment, makes its exploration of the tree of moves, makes its decision.
  - Hint-2: the steps of the construction of the move should be also beneficial for interaction between the Presenter and the (Screen/ Mouse). Either the RulesEngine or the Move can notifies the Presenter of the steps of construction of the move.

## Idea for easily click on smartphone

- Only click a box, no attempt to click on the ball or the player inside the box.
- If the box only contains the footballer:

  - the first click selects the footballer for a "run"
  - the second click selects the footballer for a "sprint" if it is possible
  - the third click unselect the footballer.

- If the box only contains the footballer and the ball:

  - the first click selects the ball for a "kick" if it is possible

  - the second click selects the footballer for a "run"

  - the third click selects the footballer for a "sprint" if it is possible

  - the fourth click unselect the footballer

## Idea for interfacing "sprint"

- button with three states:

  - "sprint: off" ; this is the state at initialization.
  - "sprint: on" ; this is the state when it is going to be used.
  - "sprint: over" ; this is the state when it has been used.

## Idea for run/sprint/kick options

Articulate the options as a sort of states and transitions machinery:

- "run" is a state.
- "sprint-on/on/over" is a sub-state of "run".
- Transition , in both directions, is possible between "sprint:on" and "sprint:off".
- Transition from "sprint:on" to "sprint:over" is possible, but cannot be reversed.
- "kick" is a state.
- Transition, in both directions, is possible between "run" and "kick".
- When entering in state "run", the default sub-state is "sprint:off", unless "sprint:over" has been reached.

Use priorities in the states of options:

- run (if canRun)

  - sprint:off
  - sprint:on (if canSprint)

- kick (if canKick)

## Regarding the move, other idea for organizing the interaction between the engine and the player

| Step | Engine                                   | Player                                   |
| ---- | ---------------------------------------- | ---------------------------------------- |
| 1    | Find the selectable sources that run and/or kick. |                                          |
| 2    |                                          | Select one of the selectable source.     |
| 3    | Find the selectable options (run/sprint/kick). |                                          |
| 4    | Select the first selectable option.      |                                          |
| 5    | Find the selectable destinations.        |                                          |
| 6    |                                          | Change the option among the selectable options. |
| 7    | Find the selectable destinations.        |                                          |
| 8    |                                          | Select one of the selectable destination. |
| 9    | Play the move.                           |                                          |

When finding selectable options or finding selectable destinations, the costs are evaluated.

## Ideas for synchronizing the Engine state and the Presenter state

- Engine export a state to Presenter without using pointers, but just integers.
- Engine exported state includes:

  - The active team
  - The ball position
  - For each Team:

    - Its score
    - Its sprint status
    - Its move credits
    - For each of its Footballers:

      - Its position
      - Its force

  - matchIsActive status (whether one Team wins )

  - moveCanCancel

  - moveCanConfirm

  - selectable boxes

  - selectable Footballers

  - selected footballer

  - ballIsSelectable

  - ballIsSelected

- Player actions to be transmitted to the Engine are:

  - matchCancel()
  - turnConfirm() if turn.isActive
  - turnCancel() if turn.isActive
  - selectBall() as reaction to "click"
  - selectFootballer( {ix:? ; iy:?} ) as reaction to "click"
  - unselectBall() as reaction to "click"
  - unselectFootballer( {ix:? ; iy:?} ) as reaction to "click"
  - selectBox( {ix:? , iy:?} ) as reaction to "click"

## Model

Attributes

- Field as a rectangular grid of Square
- 2 Teams of 6 Footballers
- Ball
- activeTeam
- match, round, turn, move ?

Creating

- Field
- Square
- Footballer
- Team
- Ball

Positioning
- Field::clear
- Square::clean
- Square::setFootballer
- Square::setBall

Enabling
- Footballer::enableSelection(condition)
- Footballer::enableKick (condition)
- Footballer::enableRun (condition)
- Ball::enableSelection(condition)
- Square::enableSelection(condition)
- Move::enableSprint(condition)
- Turn::enableConfirm(condition)
- Turn::enableCancel(condition)

Selecting

- Footballer::select(condition)
- Ball::selection(condition)
- Square::select(condition)
- Move::selectSprint(condition)
- Turn::confirm()
- Turn::cancel()

Cloning

* Model::cloneStructure
* Model::cloneState

Querying

## Using the Model

- The Presenter creates an Engine
  * The Engine creates the Engine Model
  * The Engine builds the structure of the Engine Model
- The Presenter creates an UI Model
- The Presenter requests the UI Model to clone the structure of the Engine Model
- The Presenter registers itself as Observer of Engine Model
- The Agent can be:
  - Local UI Agent
  - Remote UI Agent
  - Local IA Agent
  - Remote IA Agent
- The UI Model can display:
  - The actual Engine Model
  - The move being evaluated by some Agent (UI or IA, local or remote)
  - A switch might enable or disable the display of the opponent thinking, in case the opponent is remote or/and IA.
- The Presenter creates an Agent0 associated to Team0
- The Presenter registers itself as Observer of Agent0
- The Presenter creates an Agent1 associated to Team1
- The Presenter registers itself as Observer of Agent1
- The Presenter requests the Engine update
  - The Engine updates the state of the Engine Model
  - The Presenter requests the UI Model to clone the state of the Engine Model
- The User selects some UI item
  - The UI Model notifies the Presenter
  - The Presenter filters UI Model selection and transforms it as a selection on the Engine Model
  - The Presenter requests the Engine update
- The Agent0 selects something
  - The Agent0 notifies each of its observers, which is the Presenter
  - The Presenter filters notification  and transforms it as a selection on the Engine Model
  - The Presenter requests the Engine update

