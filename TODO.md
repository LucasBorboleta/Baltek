# Introduction

This document collects the milestones and the tasks for the current milestone.

# Milestones

1. BALTEK mode "two close players sharing the same browser".
2. BALTEK mode "two remote players using their own browser, synchronized thanks to JsTogether"
3. BALTEK mode "human player against an AI".
4. BALTEK mode "AI against another AI".
5. BALTEK tutorial as a merge of current "rules" and "help" texts.
6. BALTEK redesigned for smartphone and any tactile screen, at least for the modes "two close players ..." and "human against AI".
7. BLATEK packaged as an Android application.
8. BALTEK packaged as a Chrome application.

# Tasks

1. Change the versioning of rules as follows:
   * Indexes "i.j" apply to the set of translations; there is no indexes "i.j" per translation.
   * The "#!BALTEK i.j" format is named according to the first indexes "i.j" of the set of translation that describes it.
   * Consider to handle "Baltek (the rules)" into a dedicated Git depot.
2. Translate rules in Portuguese.
3. Display footballers capabilities "can kick" and "can run" as dots (see also "doc/...")
4. Clean the first implementation of BALTEK mode "two close players".
5. Write unit tests using QUnit.
6. Automate a "release" using Python (collecting and minifying released files, ...).
7. Update "Design.md".
8. Describe in a CONTRIBUTING.txt file the rules for contributing (copyright, etc.)
9. Describe the file tree in the README.md file.