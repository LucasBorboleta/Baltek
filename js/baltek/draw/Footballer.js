"use strict";
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
