"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Square = function(engine, ix, iy){
    this.__initObject(engine, ix, iy);
};

baltek.rules.Square.__initClassCalled = false;

baltek.rules.Square.__initClass = function(){

    if ( baltek.rules.Square.__initClassCalled ) return;
    baltek.rules.Square.__initClassCalled = true;

    baltek.utils.inherit(baltek.rules.Square, baltek.rules.Selectable);

    baltek.rules.Square.prototype.__initObject = function(engine, ix, iy){
        baltek.rules.Square.super.__initObject.call(this);
        this.engine = engine;
        this.ix = ix ;
        this.iy = iy ;
        this.canHostBall = false;
        this.canHostFootballer = false;
        this.ball = null ;
        this.footballers = [] ;
        this.footballers.push(null);
        this.footballers.push(null);
    };

    baltek.rules.Square.prototype.exportState = function(){
        var state = baltek.rules.Square.super.exportState.call(this);
        return state;
    };

    baltek.rules.Square.prototype.getActiveFootballer = function(){
        return this.footballers[this.engine.activeTeam.teamIndex];
    };

    baltek.rules.Square.prototype.getBall = function(){
        return this.ball;
    };

    baltek.rules.Square.prototype.getSquareIndices = function(){
        return { ix:this.ix, iy:this.iy };
    };

    baltek.rules.Square.prototype.getPassiveFootballer = function(){
        return this.footballers[this.engine.passiveTeam.teamIndex];
    };

    baltek.rules.Square.prototype.hasActiveFootballer = function(){
        return ( this.footballers[this.engine.activeTeam.teamIndex] !== null );
    };

    baltek.rules.Square.prototype.hasBall = function(){
        return ( this.ball !== null );
    };

    baltek.rules.Square.prototype.hasPassiveFootballer = function(){
        return ( this.footballers[this.engine.passiveTeam.teamIndex] !== null );
    };

    baltek.rules.Square.prototype.setActiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null ),
        baltek.utils.assert( footballer.team.teamIndex === this.engine.activeTeam.teamIndex );
        this.setFootballer(footballer);
    };

    baltek.rules.Square.prototype.setBall = function(ball){
        baltek.utils.assert( this.canHostBall );
        baltek.utils.assert( ball !== null );

        if ( this.ball !== ball ) {
            baltek.utils.assert( this.ball === null );

            if ( ball.square !== null ) {
                ball.square.ball = null;
            }
            this.ball = ball;
            ball.square = this;
        }
    };

    baltek.rules.Square.prototype.setFootballer = function(footballer){
        baltek.utils.assert( this.canHostFootballer );
        baltek.utils.assert( footballer !== null );

        if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
            baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null );

            if ( footballer.square !== null ) {
                footballer.square.footballers[footballer.team.teamIndex] = null;
            }
            this.footballers[footballer.team.teamIndex] = footballer;
            footballer.square = this;
        }
    };

    baltek.rules.Square.prototype.setPassiveFootballer = function(footballer){
        baltek.utils.assert( footballer !== null );
        baltek.utils.assert( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex );
        this.setFootballer(footballer);
    };
};
///////////////////////////////////////////////////////////////////////////////
