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
baltek.draw.Footballer = function(teamIndex, force){
    this.__initObject(teamIndex, force);
};

baltek.draw.Footballer.__initClassCalled = false;

baltek.draw.Footballer.__initClass = function(){

    if ( baltek.draw.Footballer.__initClassCalled ) return;
    baltek.draw.Footballer.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Footballer, baltek.draw.Disk);

    baltek.draw.Footballer.prototype.__initObject = function(teamIndex, force){
        baltek.draw.Footballer.super.__initObject.call(this);

        baltek.utils.assert( teamIndex === 0 || teamIndex === 1 );
        this.teamIndex = teamIndex;

        this.text = force.toString();

        var teamColor = baltek.style.colors.TEAM_COLORS[this.teamIndex] ;
        this.fillStyle = teamColor ;
        this.fillStyleSelected = teamColor ;
        this.strokeStyle = teamColor;
        this.strokeStyleSelected = baltek.style.colors.DISK_BORDER_SELECTED;
    };
};
///////////////////////////////////////////////////////////////////////////////
