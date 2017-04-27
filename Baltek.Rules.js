"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.rules = { $initCalled: false };

baltek.rules.$init = function(){
    if ( ! baltek.rules.$initCalled ) {
        baltek.rules.$initCalled = true;

        // Init any package used by this one
        baltek.utils.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Ball = function(){
    this.$init();
};

baltek.utils.inherit(baltek.rules.Ball, Object);

baltek.rules.Ball.prototype.$init = function(){
    this.box = null;
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Box = function(engine, ix, iy){
    this.$init(engine, ix, iy);
};

baltek.utils.inherit(baltek.rules.Box, Object);

baltek.rules.Box.prototype.$init = function(engine, ix, iy){
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

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null );

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}

baltek.rules.Box.prototype.setBall = function(ball){
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

baltek.rules.Box.prototype.setPassiveFootballer = function(footballer){
    baltek.utils.assert( footballer !== null );
    baltek.utils.assert( footballer.team.teamIndex === this.engine.passiveTeam.teamIndex );

    if ( this.footballers[footballer.team.teamIndex] !== footballer ) {
        baltek.utils.assert( this.footballers[footballer.team.teamIndex] === null )

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.team.teamIndex] = null;
        }
        this.footballers[footballer.team.teamIndex] = footballer;
        footballer.box = this;
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Engine = function(){
    this.$init();
};

baltek.utils.inherit(baltek.rules.Engine, baltek.utils.Observable);


baltek.rules.Engine.prototype.$init = function(){

    this.teams = [];
    this.teams.push(null);
    this.teams.push(null);

    this.teams[0] = new baltek.rules.Team(0);
    this.teams[1] = new baltek.rules.Team(1);

    this.activeTeam = this.teams[0];
    this.passiveTeam = this.teams[1];

    this.ball = new baltek.rules.Ball();

    this.field = new baltek.rules.Field(this);
    this.field.initBallAndTeamsBoxes();
}

baltek.rules.Engine.prototype.getBallBoxIndices = function(){
    return { ix:this.ball.box.ix, iy:this.ball.box.iy };
}

baltek.rules.Engine.prototype.getFieldNx = function(){
    return this.field.nx;
}

baltek.rules.Engine.prototype.getFieldNy = function(){
    return this.field.ny;
}

baltek.rules.Engine.prototype.getFooballerBoxIndices = function(teamIndex, footballerIndex){
    var box = this.teams[teamIndex].footballers[footballerIndex].box;
    return { ix:box.ix, iy:box.iy };
}

baltek.rules.Engine.prototype.getFooballerCount = function(teamIndex){
    return this.teams[teamIndex].footballers.length;
}

baltek.rules.Engine.prototype.getFooballerForce = function(teamIndex, footballerIndex){
    return this.teams[teamIndex].footballers[footballerIndex].force;
}

baltek.rules.Engine.prototype.hasFieldBox = function(ix, iy){
    return ( this.field.boxesByIndices[ix][iy] !== null );
}

baltek.rules.Engine.prototype.setActiveTeam = function(activeTeam){
    if ( activeTeam !== this.activeTeam ) {
        this.switchActiveAndPassiveTeams();
    }
}

baltek.rules.Engine.prototype.setPassiveTeam = function(passiveTeam){
    if ( passiveTeam !== this.passiveTeam ) {
        this.switchActiveAndPassiveTeams();
    }
}

baltek.rules.Engine.prototype.switchActiveAndPassiveTeams = function(){
    var oldActiveTeam = this.activeTeam;
    var oldPassiveTeam = this.passiveTeam;
    this.activeTeam = this.oldPassiveTeam;
    this.passiveTeam = this.oldActiveTeam;
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Field = function(engine){
    this.$init(engine);
};

baltek.utils.inherit(baltek.rules.Field, Object);

baltek.rules.Field.prototype.$init = function(engine){
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

baltek.rules.Field.prototype.initBallAndTeamsBoxes = function(){

    // First: reset all boxes, from field, ball and teams

    var box = null;
    var ix = 0;
    var iy = 0;
    for ( ix=this.firstX; ix<=this.lastX; ix++ ) {
        for ( iy=this.firstY; iy<=this.lastY; iy++ ) {
            box = this.boxesByIndices[ix][iy];
            if ( box !== null ) {
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

    // Second: set boxes for the active team

    var activeIndex = this.engine.activeTeam.teamIndex;
    var activeOriginX = (1 - activeIndex)*this.firstX + activeIndex*this.lastX;
    var activeDirectionX = 1 - 2*activeIndex

    this.boxesByIndices[activeOriginX + this.TSS*activeDirectionX][this.middleY].setBall(this.engine.ball);

    // Third: set boxes for the passive team

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
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Footballer = function(team, force){
    this.$init(team, force);
};

baltek.utils.inherit(baltek.rules.Footballer, Object);

baltek.rules.Footballer.prototype.$init = function(team, force){
    this.team = team;
    this.force = force;
    this.box = null;
    this.canKick = false;
    this.canRun = false;
}
///////////////////////////////////////////////////////////////////////////////
baltek.rules.Team = function(teamIndex){
    this.$init(teamIndex);
};

baltek.utils.inherit(baltek.rules.Team, Object);

baltek.rules.Team.prototype.$init = function(teamIndex){
    this.teamIndex = teamIndex ;
    this.goalBox = null; // the box to be defended by the team
    this.score = 0;
    this.canSprint = false;
    this.haveGoaled = false;
    this.credit = 0;

    // Populate the team
    this.footballer3 = new baltek.rules.Footballer(this, 3);  // captain
    this.footballer2t = new baltek.rules.Footballer(this, 2); // @ top
    this.footballer2b = new baltek.rules.Footballer(this, 2); // @ bottom
    this.footballer1t = new baltek.rules.Footballer(this, 1); // @ top
    this.footballer1m = new baltek.rules.Footballer(this, 1); // @ middle
    this.footballer1b = new baltek.rules.Footballer(this, 1); // @ bottom

    this.footballers = [];
    this.footballers.push(this.footballer3);
    this.footballers.push(this.footballer2t);
    this.footballers.push(this.footballer2b);
    this.footballers.push(this.footballer1t);
    this.footballers.push(this.footballer1m);
    this.footballers.push(this.footballer1b);
}
///////////////////////////////////////////////////////////////////////////////
