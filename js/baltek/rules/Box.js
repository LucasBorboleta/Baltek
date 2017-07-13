"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Box = function(engine, ix, iy){
    this.__initObject(engine, ix, iy);
};

baltek.rules.Box.__initClassCalled = false;

baltek.rules.Box.__initClass = function(){

    if ( baltek.rules.Box.__initClassCalled ) return;
    baltek.rules.Box.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Box, Object);

    baltek.rules.Box.prototype.__initObject = function(engine, ix, iy){
        this.engine = engine;
        this.ix = ix ;
        this.iy = iy ;
        this.canHostBall = false;
        this.canHostFootballer = false;
        this.ball = null ;
        this.footballers = [] ;
        this.footballers.push(null);
        this.footballers.push(null);
    }

    baltek.rules.Box.prototype.getActiveFootballer = function(){
        return this.footballers[this.engine.activeTeam.teamIndex];
    }

    baltek.rules.Box.prototype.getBall = function(){
        return this.ball;
    }

    baltek.rules.Box.prototype.getBoxIndices = function(){
        return { ix:this.ix, iy:this.iy };
    }

    baltek.rules.Box.prototype.getPassiveFootballer = function(){
        return this.footballers[this.engine.passiveTeam.teamIndex];
    }

    baltek.rules.Box.prototype.hasActiveFootballer = function(){
        return ( this.footballers[this.engine.activeTeam.teamIndex] !== null );
    }

    baltek.rules.Box.prototype.hasBall = function(){
        return ( this.ball !== null );
    }

    baltek.rules.Box.prototype.hasPassiveFootballer = function(){
        return ( this.footballers[this.engine.passiveTeam.teamIndex] !== null );
    }

    baltek.rules.Box.prototype.setActiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null ),
        baltek.utils.assert( footballer.team.teamIndex === this.engine.activeTeam.teamIndex );
        this.setFootballer(footballer);
    }

    baltek.rules.Box.prototype.setBall = function(ball){
        baltek.utils.assert( this.canHostBall );
        baltek.utils.assert( ball !== null );

        if ( this.ball !== ball ) {
            baltek.utils.assert( this.ball === null );

            if ( ball.box !== null ) {
                ball.box.ball = null;
            }
            this.ball = ball;
            ball.box = this;
        }
    }

    baltek.rules.Box.prototype.setFootballer = function(footballer){
        baltek.utils.assert( this.canHostFootballer );
        baltek.utils.assert( footballer !== null );

        if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
            baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null );

            if ( footballer.box !== null ) {
                footballer.box.footballers[footballer.team.teamIndex] = null;
            }
            this.footballers[footballer.team.teamIndex] = footballer;
            footballer.box = this;
        }
    }

    baltek.rules.Box.prototype.setPassiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null );
        baltek.utils.assert( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex );
        this.setFootballer(footballer);        
    }
}
///////////////////////////////////////////////////////////////////////////////
