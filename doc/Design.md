# Introduction

This document collects principles for the design of BALTEK.

# General design

Let us decouple the various aspects of the software in order achieved the following objectives:

- Playing against an AI.
- Playing against a remote player.
- Playing either on a desktop computer or a smart phone.
- Changing the visual aspect of the software.

Let us get inspiration from the **Model View Presenter (MVP)**

> ```
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

Step | View             | Presenter                   | Model
---- | ---------------- | --------------------------- | -----------------------
1    | sends user event |                             |
2    |                  | receives user event         |
3    |                  | requests model change       |
4    |                  |                             | updates model
5    |                  |                             | send state-change event
6    |                  | receives state-change event |
7    |                  | request view change         |
8    | updates view     |                             |

The previous objectives implies the following cluster of classes:

## Cluster for the state of game (Model)

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

## Cluster for the Presenter

These classes manage:

- The overall initialization of the software.
- The coordination between all other clusters.
- The captures of events.

## Cluster for the View

These classes manage the drawing. Nothing else.

## Cluster for the AI

These classes represent a virtual player.

From a given state of the game, the AI provides moves. An advanced AI might also used the previous states of the game in order to provides the next moves.

## Cluster for the remote interaction

These classes are responsible for:

- Initializing the remote connection.
- Transforming local event into remote event, and vice versa.

# The game phases

Hereafter are the phases that are relevant and useful for organizing the software

- 1 match is composed of n >= 1 rounds
- 1 round begins after each kickoff
- 1 round ends after a goal by one player
- 1 round is composed of n >= 1 turns
- 1 turn is devoted to a given player
- 1 turn is composed of n >= 0 moves
- 1 move is the smallest action that a player can decide
