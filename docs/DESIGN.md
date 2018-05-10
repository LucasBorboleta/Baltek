# DESIGN

## Introduction

This document aims at collecting implementation principles and choices, as well as thoughts for not yet implemented features. 

## Technologies

The implementation relies on:

* HTML5:  its canvas feature is used for drawing the field, the ball and the footballers.
* CSS: it concentrates most of the style characteristics (colors, sizes, ...) of BALTEK. It takes benefit of two CSS frameworks: [normalize.css](http://github.com/necolas/normalize.css/) and [w3.css](http://www.w3schools.com/w3css/).
* JavaScript:
  * JavaScript is used in its ECMAScript 5 flavor in order to be directly accepted by most of the web browsers.
  * Piece of code from [JavaScript.isSexy ](http://javascriptissexy.com/)blog has been reused in order to provide Objet Oriented Programming with classes in JavaScript. 
  * [TogetherJS](https://togetherjs.com/) framework supports the synchronization of two browsers across the network. In operation this framework relies, by default, on the server at <https://hub.togetherjs.com>.
  * [jQuery](https://jquery.com/) and [QUnit](https://qunitjs.com/) frameworks support unit test automation.
* Python:
  * It is used only during development for automating the update of files in order to avoid manual copy/paste operations.
  * It is used only during some test for starting a simple HTTP server in order to simulate the hosting the BALTEK files by a web site like a blog.

## Design patterns

The following design patterns have been used by purpose:

* **Model/View/Presenter**:
  * The Presenter creates the Model and the View .
  * The Model implements the BALTEK rules. The Model does not know about the GUI.
  * The View implements the buttons and the drawing of the footballers. The View does know about the BALTEK rules.
  * The basic sequence of interaction is as follows:
    1. The Model notifies the Presenter about its internal changes.
    2. The Presenter modifies the View (using its API) correspondingly to the Model state.
    3. The View notifies the Presenter about user interaction (button press or mouse click).
    4. The Presenter modifies the Model (using its API)
* **Observable/Observers**: all notifications are implemented using this pattern.
* **State**: the reactions of the Presenter to notification are organized by states and sub-states using this pattern and the hierarchical nested states of UML. 

## Namespaces

TODO: explain the conventions related to modules, functions and classes.

## Class and inheritance

TODO: explain conventions for defining classes.

## Namespaces for unit tests

TODO: explain conventions related to test-Modules, test-Suite, test-Case and test-Environment.

## The game phases

Hereafter are the phases that are relevant and useful for organizing the software:

- Each match is composed of $n \ge 1$ rounds. 
- Each match is necessarily won by one of the players after $n \le 3$ rounds.
- Each  round begins after each kickoff.
- Each  round ends after a goal by one player.
- Each  round is composed of $n \ge 1$  turns.
- Each  turn is devoted to a given player.
- Each  turn is composed of $n \ge 0$  moves.
- Each move implies the following elementary decisions by the active player:
  - Selection of a source box.
  - Selection of either the ball or a footballer.
  - Selection or not the sprint bonus, if available.
  - Selection of a destination box.

Confirm/undo:

- Each turn has to be confirmed.
- Each turn can be undone. 
- A single move cannot be undone.
- The selection of the source box can be unselected, if the destination box is not already selected.
- The sprint bonus can be unselected, if the destination box is not already selected.

## IA design

Let us determine a bound for the possible moves:

- 6 boxes, related to the six footballers are selectable.
- 3 kinds of moves are possible:

  - kick
  - run
  - sprint
- For a kick $(5 \times 5 - 1) = 24$  destination boxes are possible at most.
- For a run $(3 \times 3 - 1) = 8$  destination boxes are possible at most.
- For a sprint $( (5 \times 5 - 1) - (3 \times 3 -1) = (24 - 8) = 16$ destination boxes are possible at most.
- For a move, $6 \times (24 + 8 + 16) = 6*48 = 288$ occurrences are possible at most.
- In a turn, $(0 + 1 +2 + 3) \times 288 = 1728$  occurrences are possible at most. 

Let us determine a bound for a tree of depth $d$:

* $d=1$ : turn-of-player-0 $\rightarrow$ $1728$ occurrences.
* $d=2$ : turn-of-player-0 + turn-of-player-1 + turn-of-player-0 $\rightarrow$ $(1+2) \times 1728$ occurrences.
* $d$  $\rightarrow$ $(1+2 \times (d-1)) \times 1728$ occurrences $=(2d-1) \times 1728$ occurrences.

