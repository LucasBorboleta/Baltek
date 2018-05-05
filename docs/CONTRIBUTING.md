# Contributing to baltek-the-program

👍🎉 Thanks for taking the time to contribute! 🎉👍

## What languages can you use

In this project, you have to use English for exchanging, coding and documenting.

Esperanto, French and Portuguese have been already used only for internationalization of the labels and texts being visible in the interface.

All other languages are welcome for internationalization the interface.

## What can you contribute

- You can start the internationalization of the interface in a new language.
- You can correct an existing internationalization.
- You can fix coding errors in files (HTML, CSS, JS, ...).
- You can correct the wording in the documentation files.
- You can work the next milestone of the [ROADMAP](./ROADMAP.md).
- If your interest in the evolution of the rules, then move to the sister project [baltek-the-rules](https://github.com/LucasBorboleta/baltek-the-rules).


## How do you exchange

You can exchange by:

- Reporting error or proposing enhancement using the [GitHub](https://github.com) ticketing solution at [baltek-the-program/issues](https://github.com/LucasBorboleta/baltek-the-program/issues).
- Proposing code using the [GitHub](https://github.com) pull-request solution at [baltek-the-program/pulls](https://github.com/LucasBorboleta/baltek-the-program/pulls).

## How do you get started

- Read the introductory [README](../README.md) document.
- Play the game either from the blog [Lucas Borboleta](http://lucas.borboleta.blog.free.fr) or download its latest release from  [there](https://github.com/LucasBorboleta/baltek-the-program/releases).
- Create a [GitHub](https://github.com) account. This is the prerequisite for issuing a ticket.
- If you intent to propose code, then:

  - Learn how to use [GitHub](https://github.com) in some sandbox project.
  - Read all sections of this document about files, testing...

- Read the [CODE-OF-CONDUCT](./CODE-OF-CONDUCT.md) document about expected behavior of contributors. Most probably, a translation in your native language can be found at <https://www.contributor-covenant.org>.

## How do you find and store files

Here is the organization of the files:

- The [README](../README.md) file is stored at the root of the project. All other documentation files ([LICENSE](./LICENSE.md), [CONTRIBUTING](./CONTRIBUTING.md)...) are stored in the [docs](./.) folder, itself located at the root of the project. These files are named with capitalized letters leading to words joined with `-` but not with `_`. Their extensions are either `.txt` or `.md`.
- The [DESIGN](./DESIGN.md) document describes the chosen architecture and conventions about classes, functions and variables.
- The main files are grouped and stored as packages in the [packages](../packages) folder. The present project corresponds to the [baltek-the-program](../packages/baltek-the-program) and  [baltek-the-program-test](../packages/baltek-the-program-test) packages. The other packages correspond to imported projects.
- Beneath each package root, the following subfolders group the files according to their types: `html`, `css`, `js`, `pictures`. Going deeper, sub-subfolders might be created if they bring added value.
- Links between files beneath the [packages](../packages) folder are always expressed using relative paths starting like `../../../packages/`.
- At the root of the project, the [index.html](../index.html) file launches the [baltek-the-program](../packages/baltek-the-program) package, thanks to a minimal amount of code.
- The [tools](../tools) folder provides Python scripts for automation:

  - [update-files.py](../tools/update-files.py) :
    - It duplicates the [LICENSE](../docs/LICENSE.md), [CONTRIBUTORS](../docs/CONTRIBUTORS.md) and [VERSION](../docs/VERSION.txt) files at the root of the [baltek-the-program](../packages/baltek-the-program) package.
    - For each selected file of the project (see the script), it updates the following items that are identified thanks to special tags (see the script):
      - the license lines from the Markdown file.
      - the credits text lines lines from the Markdown file.
      - the version strings of **baltek-the-rules** and **baltek-the-program** from their text files.
  - [test.html](../tools/test.html) launches unit tests in your web browser thanks to [QUnit](https://qunitjs.com/) and [jQuery](https://jquery.com/). All unit tests are stored in the [baltek-the-program-test](../packages/baltek-the-program-test) package.

## How do you test

New and modified HTML files have to be tested manually as follows:

- The [W3C HTML validator](https://validator.w3.org) must validate each file without any error.
- All hyperlinks must be checked with success.
- The game must be playable without error by at least two browsers amongst Chrome, Firefox, Internet Explorer, Opera.

JavaScript classes and functions can be automatically tested using [test.html](../tools/test.html) file in your web browser.

The test plan described in the [TEST-PLAN](./TEST-PLAN.md) document has to be applied manually.

## How do you register contributors

The [CONTRIBUTORS.md](./CONTRIBUTORS.md) file registers the Baltekians who are the people have contributed in one of the following ways to the project:

- People who reported issues, then being treated.
- People who proposed code, then being integrated.
- People outside GitHub who get known for their feedbacks as game testers or linguistic correctors.

Developer creating or merging a pull-request, or treating an issue, is responsible for updating the [CONTRIBUTORS.md](./CONTRIBUTORS.md) file with the names of the involved Baltekians.
