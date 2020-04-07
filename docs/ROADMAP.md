# ROADMAP

## Introduction

This document collects the milestones for the **baltek-the-program** project and the tasks for the current milestone.

## Milestones

- [ ] BALTEK mode "two remote players using their own browser" **manually** synchronized **without** TogetherJS.
- [ ] BALTEK mode "_human player against an AI_".
- [ ] BALTEK mode "_AI against another AI_".
- [ ] BALTEK with a correct coverage by unit tests.

## Tasks

- [ ] Implement a workaround to the unavailability of the Hub server by TogetherJS.
- [ ] In HTML pages of "guide", replace rounded pictures with squared pictures.
- [ ] Redesign as necessary for implementing the simplest AI (random chooser).
  - [ ] Understand the assertion failure when using a Dispatcher in the context of two synchronized browsers.
  - [ ] Understand the root cause of the stack overflow when not using  a Dispatcher.
  - [ ] Fix the Dispatcher design or elaborate a new design in order to fix all above defects.
- [ ] Design an AI that explores the move tree.
