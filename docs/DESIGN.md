# DESIGN

## Introduction

This document aims at collecting implementation principles. 

The next section brings an overview of the used technologies. 

The other sections of the document focuses on how JavaScript (JS) has been used. 

The other technologies (HTML5 and CSS) are not here described because they are concerning a very few files that the developer can learn about by his/her own.

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

## Namespace for JS sources

The sources are defining symbols for either objects or functions or classes. These definitions are stored in files and folders. Hereafter are the governing principles:

* All symbols are hierarchically defined according to a tree structure whose unique root is `baltek`.
* The first level of the hierarchy corresponds to the concept of `module`; example: `baltek.utils`.
* A `module` is implemented as a folder, an initializer file and an initializer function; examples:
  * folder `baltek`, initializer file `baltek/baltek-init.js` and initializer function `baltek.__initModule()`.
  * folder `baltek/utils`, initializer file `baltek/utils/utils-init.js` and initializer function `baltek.utils.__initModule()`.
* A `module` can define global objects and functions in its initializer file; examples:
  *  `baltek.isInteractive` is a global Boolean defined in the file `baltek/baltek-init.js` by the initializer function `baltek.__initModule()`.
  * `baltek.utils.baltek.utils.assert(condition, message)` is a function defined in the file  `baltek/utils/utils-init.js`
* A `module` can define classes. Each class is defined by its own file stored beneath the module folder; example: the class `baltek.utils.Observable` is stored in the file `baltek/utils/Observable.js`.
* Each class is defined by two functions: an object constructor and a class definer ; example for the class  `baltek.utils.Observable`:
  * The function `baltek.utils.Observable()` constructs an object of that class.
  * The function  `baltek.utils.Observable.__initClass` defines the inheritance and all the methods of that class.
* Each module triggers the initialization of its required modules by calling their initializer functions `__initModule()`. Boolean guard `<module>.__initModuleCalled` ensures that each initializer function is called only once. Another module is required because one of its own function or class is requiring it.
* Each module triggers the definitions of its inner classes by calling their definer functions `__initClass`(). Boolean guard `<class>.__initClassCalled`ensures that each definer function is called only once.
* A section below brings more details about implementation of classes.
* Note the usage of the suffix `-init` and of prefix `__` made of two underscores.

## Namespace for JS unit tests

Unit tests are defining `test-modules`, `test-suites`, `test-cases`, `test-environments` and are making assertions. They are handled by the QUnit framework.   Hereafter are the governing principles:

* All unit test symbols are hierarchically defined according to a tree structure whose unique root is `baltek_tm`, which corresponds to a `test-module`.
* A `test-module` is implemented as a folder, an initializer file, an initializer function and a QUnit module; examples:
  - folder `baltek_tm`, initializer file `baltek_tm/baltek_tm-init.js, `initializer function `baltek_tm.__initTestModule()` that defines the QUnit module of name `baltek_tm`.
  - folder `baltek_tm/utils_tm`, initializer file `baltek_tm/utils_tm/utils_tm-init.js`, initializer function `baltek_tm.utils_tm.__initTestModule()` that defines the QUnit module by `QUnit.module( "utils_tm" , ...)`.
* A `test-suite` is implemented as a file and an initializer function and a QUnit module; examples:
  * file `baltek_tm/utils_tm/inherit_ts.js` file and `baltek_tm/utils_tm/inherit_ts.__initTestSuite()` initializer function that defines the QUnit module by `QUnit.module( "inherit_ts" , ...)`.
  * file `baltek_tm/utils_tm/Observable_ts.js` file and `baltek_tm/utils_tm/Observable_ts.__initTestSuite()` initializer function that defines the QUnit module`QUnit.module( "Observable_ts" , ...)`, which is dedicated to the test of class `Observable`.
* A `test-case` is implemented in either a `test-module` or a `test-suite` by `QUnit.test( "<test>" , ...)`; examples:
  * `baltek_tm.utils_tm` defines `QUnit.test( "assert_tc" , ...)` that tests the function `baltek.utils.assert`.
  * `baltek_tm.utils_tm.Observable_ts` defines `QUnit.test( "notifyObservers_tc" , ...)` that tests the method `notifyObservers` of the class `baltek.utils.Observable`.
* A `test-module` or a `test-suite` can factorize a `test-environment` by defining a function `__init_testEnvironment()` to be called by any relevant `test-case`; example:
  * `baltek_tm.utils_tm.Observable_ts` defines `__init_testEnvironment()`, which is called by  `notifyObservers_tc`, `registerObserver_tc` and `unregisterObserver_tc`.
* Each `test-module` triggers the initializer function of each of its inner `test-module` and inner `test-suite`. Because the `test-modules` and `test_suites` are independent no Boolean guard is used.
* Note the usage of the suffixes `-init`, `_tm`, `_ts` ,`_tc` and of the prefix `__` made of two underscores.

## Class and inheritance for JS

An example of defining a class using inheritance is given by `baltek.widget.Selector` in the file `baltek/widget/Selector.js`. The schema is the following:

* Declare the object constructor:

```javascript
  baltek.widget.Selector = function(id, i18nTranslator, values){
      this.__initObject(id, i18nTranslator, values);
  };
```

* Declare the class uninitialized:

```javascript
baltek.widget.Selector.__initClassCalled = false;
```

* Start defining the class initializer:

```javascript
    baltek.widget.Selector.__initClass = function(){ ...
```

* Declare the class initialized 

```javascript
    if ( baltek.widget.Selector.__initClassCalled ) return;
    baltek.widget.Selector.__initClassCalled = true;
```

  * Declare the inheritance (`Selector` inherits from `Widget`):

```javascript
    baltek.utils.inherit(baltek.widget.Selector, baltek.widget.Widget);
```

  * Declare the method for initializing an object; invoke the initialization of the super-class (`Widget`):

```javascript
    baltek.widget.Selector.prototype.__initObject = function(id, i18nTranslator, values){
        baltek.widget.Selector.super.__initObject.call(this, id, i18nTranslator);
        ...
    };
```

  * Declare the other methods:

~~~javascript
    baltek.widget.Selector.prototype.getSelection = function(){
        return this.element.value;
    };
	...
~~~

- End defining the class initializer:

```javascript
};
```

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

## Confirm/undo and select/unselect

- Each turn has to be confirmed.
- Each turn can be undone. 
- A single move cannot be undone.
- The selection of the source box can be unselected, if the destination box is not already selected.
- The sprint bonus can be unselected, if the destination box is not already selected.

## Design patterns

The following design patterns have been used by purpose:

- **Model-View-Presenter**:
  - The Presenter creates the Model and the View .
  - The Model implements the BALTEK rules. The Model does not know about the GUI.
  - The View implements the buttons and the drawing of the footballers. The View does know about the BALTEK rules.
  - The basic sequence of interaction is as follows:
    1. The Model notifies the Presenter about its internal changes.
    2. The Presenter modifies the View (using its API) correspondingly to the Model state.
    3. The View notifies the Presenter about user interaction (button press or mouse click).
    4. The Presenter modifies the Model (using its API)
- **Observable/Observers**: all notifications are implemented using this pattern.
- **State**: the reactions of the Presenter to notification are organized by states and sub-states using this pattern and the hierarchical nested states of UML. 

## Responsibilities of modules

The Model-View-Presenter (MVP) is implemented by classes, functions and global objects that are grouped my modules. Here are the responsibilities of each module:

* The Presenter aspect of MVP is supported by the module `baltek.presenter` .
* The Model aspect of MVP is supported by the module `baltek.rules`. The main class `baltek.rules.Engine` implements the BALTEK rules.
* The View aspect of MVP is supported by the following modules:
  * `baltek.widget` wraps classical HTML interactive elements like button, selector, iframe, etc.
  * `baltek.draw` provides primitive for drawing boxes, ball and footballers in the HTML canvas element.
  * `baltek.i18n` supports the dynamic change of language (English, French, ...).
  * `baltek.style` provides factorization of colors, fonts, ...

The remaining modules are:

* `baltek.utils` that provides functions and classes helpful for the other modules.
* `baltek.debug` that provides logging of messages for debugging.

## Thoughts for IA design

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

