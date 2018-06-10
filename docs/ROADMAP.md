# ROADMAP

## Introduction

This document collects the milestones for the **baltek-the-program** project and the tasks for the current milestone.

## Milestones

- [x] BALTEK mode "_two close players sharing the same browser_".
- [x] BALTEK mode "_two remote players using their own browser, synchronized thanks to JsTogether_"
- [x] BALTEK ready for accepting contributions.
- [ ] BALTEK mode "_human player against an AI_".
- [ ] BALTEK with a correct coverage by unit tests.
- [ ] BALTEK mode "_AI against another AI_".
- [ ] BALTEK GUI redesigned for smartphone/tactile surface.

## Tasks

- [ ] Redesign as necessary for implementing the simplest AI (random chooser).
  - [ ] Understand the assertion failure when using a Dispatcher in the context of two synchronized browsers.
  - [ ] Understand the root cause of the stack overflow when not using  a Dispatcher.
  - [ ] Fix the Dispatcher design or elaborate a new design in order to fix all above defects.
- [ ] Design an AI that explores the move tree.
