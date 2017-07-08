"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Field = function(engine){
    this.__initObject(engine);
};

baltek.rules.Field.__initClassCalled = false;

baltek.rules.Field.__initClass = function(){

    if ( baltek.rules.Field.__initClassCalled ) return;
    baltek.rules.Field.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Field, Object);

    baltek.rules.Field.prototype.__initObject = function(engine){
        this.engine = engine;

        // Team square side
        // (The team square is the set of boxes that can be occupied by the
        // footballers of a given team at each kickoff)
        this.TSS = 5;

        // Number of box rows
        this.ny = this.TSS ;

        // Number of box rows, including goal boxes
        this.nx = 2*( this.TSS + 1 ) ;

        this.firstX = 0;
        this.lastX = this.nx - 1;
        this.middleX = Math.round((this.firstX + this.lastX)/2);

        this.firstY = 0;
        this.lastY = this.ny - 1;
        this.middleY = Math.round((this.firstY + this.lastY)/2);

        this.boxesByIndices = [] ;

        var box = null;
        var ix = 0;
        var iy = 0;

        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            this.boxesByIndices.push([]);

            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                this.boxesByIndices[ix].push(null);

                if ( ix === this.firstX || ix === this.lastX ) {
                    if ( iy === this.middleY ) {
                        box = new baltek.rules.Box(this.engine, ix , iy);
                        box.canHostBall = true;
                        box.canHostFootballer = false;
                        this.boxesByIndices[ix][iy] = box;
                    }
                } else {
                    box = new baltek.rules.Box(this.engine, ix , iy);
                    box.canHostBall = true;
                    box.canHostFootballer = true;
                    this.boxesByIndices[ix][iy] = box;
                }
            }
        }

        var activeIndex = this.engine.activeTeam.teamIndex;
        var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
        var activeDirectionX = 1 - 2*activeIndex

        var agix =  activeOriginX;
        var agiy = this.middleY;
        this.engine.activeTeam.goalBox = this.boxesByIndices[agix][agiy] ;

        var passiveIndex = this.engine.passiveTeam.teamIndex;
        var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
        var passiveDirectionX = 1 - 2*passiveIndex

        var pgix =  passiveOriginX;
        var pgiy = this.middleY;
        this.engine.passiveTeam.goalBox = this.boxesByIndices[pgix][pgiy] ;
    }

    baltek.rules.Field.prototype.clearBallAndFootballerBoxes = function(){
        var box = null;
        var ix = 0;
        var iy = 0;
        for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
            for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
                box = this.boxesByIndices[ix][iy];
                if ( box !== null ) {
                    box.ball = null;
                    box.footballers[this.engine.activeTeam.teamIndex] = null;
                    box.footballers[this.engine.passiveTeam.teamIndex] = null;
                }
            }
        }

        this.engine.ball.box = null;

        var n = 0;
        var i = 0;

        n = this.engine.activeTeam.footballers.length;
        for ( i=0; i<n; i++) {
            this.engine.activeTeam.footballers[i].box = null;
        }

        n = this.engine.passiveTeam.footballers.length;
        for ( i=0; i<n; i++) {
            this.engine.passiveTeam.footballers[i].box = null;
        }
    }

    baltek.rules.Field.prototype.initBallAndFootballerBoxes = function(){

        // First: clear all boxes, from field, ball and teams
        this.clearBallAndFootballerBoxes();

        // Second: set boxes for the active and passive teams

        var activeIndex = this.engine.activeTeam.teamIndex;
        var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
        var activeDirectionX = 1 - 2*activeIndex

        this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setBall(this.engine.ball);

        this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer3);
        this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer2t);
        this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer2b);
        this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.firstY].setActiveFootballer(this.engine.activeTeam.footballer1t);
        this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.middleY].setActiveFootballer(this.engine.activeTeam.footballer1m);
        this.boxesByIndices[activeOriginX + (this.TSS - 2)*activeDirectionX][this.lastY].setActiveFootballer(this.engine.activeTeam.footballer1b);

        var passiveIndex = this.engine.passiveTeam.teamIndex;
        var passiveOriginX = (1 - passiveIndex)*this.firstX + passiveIndex*this.lastX;
        var passiveDirectionX = 1 - 2*passiveIndex

        this.boxesByIndices[passiveOriginX + (this.TSS - 1)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer3);
        this.boxesByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer2t);
        this.boxesByIndices[passiveOriginX + this.TSS*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer2b);
        this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.firstY].setPassiveFootballer(this.engine.passiveTeam.footballer1t);
        this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.middleY].setPassiveFootballer(this.engine.passiveTeam.footballer1m);
        this.boxesByIndices[passiveOriginX + (this.TSS - 2)*passiveDirectionX][this.lastY].setPassiveFootballer(this.engine.passiveTeam.footballer1b);
    }
}
///////////////////////////////////////////////////////////////////////////////
