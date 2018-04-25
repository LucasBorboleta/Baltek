"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL [https://github.com/LucasBorboleta/baltek-the-program](https://github.com/LucasBorboleta/baltek-the-program).

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses](http://www.gnu.org/licenses).
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.rules = { };
baltek.rules.__initModuleCalled = false;

baltek.rules.__initModule = function(){

    if ( baltek.rules.__initModuleCalled ) return;
    baltek.rules.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.utils.__initModule();

    // Init inner classes
    baltek.rules.Ball.__initClass();
    baltek.rules.Engine.__initClass();
    baltek.rules.Field.__initClass();
    baltek.rules.Footballer.__initClass();
    baltek.rules.Selectable.__initClass();
    baltek.rules.Square.__initClass();
    baltek.rules.Team.__initClass();
};
///////////////////////////////////////////////////////////////////////////////
