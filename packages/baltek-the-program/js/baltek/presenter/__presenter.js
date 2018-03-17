"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
///////////////////////////////////////////////////////////////////////////////
baltek.presenter = { };
baltek.presenter.__initModuleCalled = false;

baltek.presenter.__initModule = function(){

    if ( baltek.presenter.__initModuleCalled ) return;
    baltek.presenter.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();
    baltek.draw.__initModule();
    baltek.i18n.__initModule();
    baltek.rules.__initModule();
    baltek.utils.__initModule();
    baltek.widget.__initModule();

    // Init inner classes
    baltek.presenter.GameStateIsFinished.__initClass();
    baltek.presenter.GameStateIsReadyToStart.__initClass();
    baltek.presenter.GameStateIsReadyToQuit.__initClass();
    baltek.presenter.GameStateIsRunning.__initClass();
    baltek.presenter.GameTopState.__initClass();
    baltek.presenter.Presenter.__initClass();
    baltek.presenter.SettingsState.__initClass();
    baltek.presenter.State.__initClass();
    baltek.presenter.SuperState.__initClass();
    baltek.presenter.TopState.__initClass();
    baltek.presenter.WhatStateShowAbout.__initClass();
    baltek.presenter.WhatStateShowHelp.__initClass();
    baltek.presenter.WhatStateShowRules.__initClass();
    baltek.presenter.WhatTopState.__initClass();
};
///////////////////////////////////////////////////////////////////////////////
