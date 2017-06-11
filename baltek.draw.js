"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw = { $initCalled: false };

baltek.draw.$init = function(){
    if ( ! baltek.draw.$initCalled ) {
        baltek.draw.$initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
        baltek.style.$init();


        baltek.draw.canvas = document.getElementById( "Baltek_DrawZone_Canvas" );

        // Force the dimensions of the canvas
        var drawZone = document.getElementById( "Baltek_DrawZone" );
        baltek.draw.canvas.width = drawZone.offsetWidth;
        baltek.draw.canvas.height = drawZone.offsetHeight;

        baltek.draw.drawer = baltek.draw.canvas.getContext( "2d" );

        if ( baltek.debug.isEnabled ) {

            baltek.draw.canvas.addEventListener('mousemove',
                function(event){
                    var mousePosition = baltek.draw.getMousePosition(event);
                    baltek.debug.mousePosition.innerHTML = "Mouse(x,y) = (" +
                        Math.floor(mousePosition.x) + ", " + Math.floor(mousePosition.y)
                        + ")" ;
                },
                false);
        }
    }
}

baltek.draw.getMousePosition = function(event){
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();
    return {
      x: event.clientX + window.pageXOffset - canvasRectangle.left,
      y: event.clientY + window.pageYOffset - canvasRectangle.top
    };
}

baltek.draw.setBoxLatticeDimensions = function(nx, ny){
    var canvasRectangle = baltek.draw.canvas.getBoundingClientRect();

    baltek.draw.nx = nx;
    baltek.draw.ny = ny;

    // From the lattice dimension (nx, ny) computes the boxSide, etc.
    baltek.draw.boxQuantum = Math.min(
        (canvasRectangle.right  - canvasRectangle.left)/baltek.draw.nx,
        (canvasRectangle.bottom - canvasRectangle.top )/baltek.draw.ny ) ;

    baltek.draw.boxSide = baltek.draw.boxQuantum ;

    baltek.draw.circleQuantum = baltek.draw.boxQuantum/4 ;
    baltek.draw.circleRadius = baltek.draw.circleQuantum*0.75 ;
}

///////////////////////////////////////////////////////////////////////////////
baltek.draw.Selectable = function(){
    this.$init();
}

baltek.utils.inherit(baltek.draw.Selectable, Object);

baltek.draw.Selectable.prototype.$init = function(){
    this.selectable = false;
    this.selected = false;

    var thisSaved = this;
    this.onClickWrapper = function(event){ thisSaved.onclick(event); };
}

baltek.draw.Selectable.prototype.contains = function(point){
    return false;
}

baltek.draw.Selectable.prototype.disableSelection = function(){
    baltek.draw.canvas.removeEventListener('click', this.onClickWrapper , false);
    this.selectable = false;
    this.draw();
}

baltek.draw.Selectable.prototype.draw = function(){
}

baltek.draw.Selectable.prototype.enableSelection = function(){
    baltek.draw.canvas.addEventListener('click', this.onClickWrapper , false);
    this.selectable = true;
    this.draw();
}

baltek.draw.Selectable.prototype.onclick = function(event){
    baltek.utils.assert(this.selectable);

    var mousePosition = baltek.draw.getMousePosition(event);
    var clicked = this.contains(mousePosition);

    if ( clicked ) {
        // Inverse the selection status
        this.selected = (! this.selected);
        this.update();
        this.draw();
    }
}

baltek.draw.Selectable.prototype.update = function(){
}
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Box = function(ix, iy, xyLabel){
    this.$init(ix, iy, xyLabel);
}

baltek.utils.inherit(baltek.draw.Box, baltek.draw.Selectable);

baltek.draw.Box.prototype.$init = function(ix, iy, xyLabel){
    baltek.draw.Box.super.$init.call(this);

    this.ball = null ;
    this.footballers = [] ;
    this.footballers.push(null);
    this.footballers.push(null);

    this.ix = ix;
    this.iy = iy;
    this.xyLabel = xyLabel;
    this.doShowXYLabel = false;

    this.x = this.ix * baltek.draw.boxSide;
    this.y = this.iy * baltek.draw.boxSide;
    this.side = baltek.draw.boxSide;

    this.fillStyle = baltek.style.colors.BOX_1;
    this.fillStyleSelected = baltek.style.colors.BOX_1;
    if ( (this.ix + this.iy) % 2 === 0 ) {
        this.fillStyle = baltek.style.colors.BOX_0;
        this.fillStyleSelected = baltek.style.colors.BOX_0;
    }
    this.strokeStyle = this.fillStyle;
    this.strokeStyleSelected = baltek.style.colors.BOX_BORDER_SELECTED;
}

baltek.draw.Box.prototype.clear = function(){

    if ( this.ball !== null ) {
        this.ball.box = null;
        this.ball = null;
    }

    if ( this.footballers[0] !== null ) {
        this.footballers[0].box = null;
        this.footballers[0] = null;
    }

    if ( this.footballers[1] !== null ) {
        this.footballers[1].box = null;
        this.footballers[1] = null;
    }

    this.draw();
}

baltek.draw.Box.prototype.contains = function(point){
    var contains = (point.x > this.x) && (point.x < (this.x + this.side)) &&
                   (point.y > this.y) && (point.y < (this.y + this.side));
    return contains;
}

baltek.draw.Box.prototype.distributeBallAndFootballers = function(){
    var dx = baltek.draw.circleQuantum;
    var dy = baltek.draw.circleQuantum;

    var guestCount = 0;

    if ( this.ball !== null ) {
        guestCount++;
        this.ball.x = this.x + 3*dx;
        this.ball.y = this.y + 1*dy;
    }

    if ( this.footballers[0] !== null ) {
        guestCount++;
        this.footballers[0].x = this.x + 1*dx;
        this.footballers[0].y = this.y + 1*dy;
    }

    if ( this.footballers[1] !== null ) {
        guestCount++;
        this.footballers[1].x = this.x + 3*dx;
        this.footballers[1].y = this.y + 3*dy;
    }

    if ( guestCount === 1 ) {

        if  (this.ball !== null ) {
            this.ball.x = this.x + 2*dx;
            this.ball.y = this.y + 2*dy;
        }

        if (this.footballers[0] !== null ) {
            this.footballers[0].x = this.x + 2*dx;
            this.footballers[0].y = this.y + 2*dy;
        }

        if ( this.footballers[1] !== null ) {
            this.footballers[1].x = this.x + 2*dx;
            this.footballers[1].y = this.y + 2*dy;
        }
    }
};

baltek.draw.Box.prototype.draw = function(){
    baltek.draw.drawer.strokeStyle = this.strokeStyle;
    baltek.draw.drawer.fillStyle = this.fillStyle;
    baltek.draw.drawer.lineWidth = baltek.style.widths.BOX_BORDER;

    if ( this.selectable ) {
        baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
        baltek.draw.drawer.fillStyle = this.fillStyleSelected;
    }

    var lw = baltek.draw.drawer.lineWidth;
    baltek.draw.drawer.strokeRect(this.x + lw/2, this.y +lw/2, this.side -lw, this.side - lw);
    baltek.draw.drawer.fillRect(this.x + lw/2,this.y +lw/2, this.side - lw, this.side - lw);


    if ( this.xyLabel != null ) {
        if ( this.doShowXYLabel ) {
            baltek.draw.drawer.fillStyle = baltek.style.colors.BOX_TEXT;
        } else {
            baltek.draw.drawer.fillStyle = this.fillStyle;
        }
        baltek.draw.drawer.font = baltek.style.fonts.BOX_TEXT;
        baltek.draw.drawer.textBaseline = "bottom";
        baltek.draw.drawer.textAlign = "start";
        baltek.draw.drawer.fillText(this.xyLabel, this.x + this.side/16, this.y + this.side*(1 - 1/16));
    }

    this.distributeBallAndFootballers();

    if ( this.ball !== null ) {
        this.ball.draw();
    }

    if ( this.footballers[0] !== null ) {
        this.footballers[0].draw();
    }

    if ( this.footballers[1] !== null ) {
        this.footballers[1].draw();
    }
}

baltek.draw.Box.prototype.setBall = function(ball){
    baltek.utils.assert( ball !== null );

    if ( this.ball !== ball ) {
        baltek.utils.assert( this.ball === null );

        if ( ball.box !== null ) {
            ball.box.ball = null;
            ball.box.draw();
        }

        ball.box = this;
        this.ball = ball;
        this.draw();
    }
}

baltek.draw.Box.prototype.setFootballer = function(footballer){
    baltek.utils.assert( footballer !== null );

    if ( this.footballers[footballer.teamIndex] !== footballer ) {
        baltek.utils.assert( this.footballers[footballer.teamIndex] === null );

        if ( footballer.box !== null ) {
            footballer.box.footballers[footballer.teamIndex] = null;
            footballer.box.draw();
        }

        footballer.box = this;
        this.footballers[footballer.teamIndex] = footballer;
        this.draw();
    }
}

baltek.draw.Box.prototype.showXYLabel = function(condition){
    this.doShowXYLabel = condition;
    this.draw();
}

baltek.draw.Box.prototype.update = function(){
    baltek.debug.writeMessage( "Box: '" + this.xyLabel + "' (" + this.ix + "," + this.iy + ") just updated!" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Circle = function(){
    this.$init();
}

baltek.utils.inherit(baltek.draw.Circle, baltek.draw.Selectable);

baltek.draw.Circle.prototype.$init = function(){
    baltek.draw.Circle.super.$init.call(this);

    this.x = undefined;
    this.y = undefined;
    this.text = null;
    this.box = null;

    this.radius = baltek.draw.circleRadius;

    this.strokeStyle = baltek.style.colors.CIRCLE_BORDER;
    this.strokeStyleSelected = baltek.style.colors.CIRCLE_BORDER_SELECTED;
    this.fillStyle = baltek.style.colors.CIRCLE_BACKGROUND;
    this.fillStyleSelected = baltek.style.colors.CIRCLE_BACKGROUND;
}

baltek.draw.Circle.prototype.contains = function(point){
    var contains = false;
    if ( this.x !== undefined && this.y !== undefined ) {
        var dx = point.x - this.x;
        var dy = point.y - this.y;
        var r = this.radius;
        contains = ( (dx*dx + dy*dy) < r*r );
    }
    return contains;
}

baltek.draw.Circle.prototype.draw = function(){

    if ( this.x !== undefined && this.y !== undefined ) {

        baltek.draw.drawer.strokeStyle = this.strokeStyle;
        baltek.draw.drawer.fillStyle = this.fillStyle;
        if ( this.selected ) {
            baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
            baltek.draw.drawer.fillStyle = this.fillStyleSelected;
        }

        baltek.draw.drawer.lineWidth = baltek.style.widths.CIRCLE_BORDER;

        var lw = baltek.draw.drawer.lineWidth;
        baltek.draw.drawer.beginPath();
        baltek.draw.drawer.arc(this.x,this.y,this.radius -lw/2, 0,2*Math.PI);
        baltek.draw.drawer.stroke();

        baltek.draw.drawer.arc(this.x,this.y,this.radius - lw/2, 0,2*Math.PI);
        baltek.draw.drawer.fill();

        if ( this.text !== null ) {
            baltek.draw.drawer.fillStyle = baltek.style.colors.CIRCLE_TEXT;
            baltek.draw.drawer.font = baltek.style.fonts.CIRCLE_TEXT;
            baltek.draw.drawer.textBaseline = "middle";
            baltek.draw.drawer.textAlign = "center";
            baltek.draw.drawer.fillText(this.text, this.x, this.y);
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Ball = function(){
    this.$init();
}

baltek.utils.inherit(baltek.draw.Ball, baltek.draw.Circle);

baltek.draw.Ball.prototype.$init = function(){
    baltek.draw.Ball.super.$init.call(this);

    this.fillStyle = baltek.style.colors.BALL_BACKGROUND ;
    this.fillStyleSelected = baltek.style.colors.BALL_BACKGROUND_SELECTED;
    this.strokeStyle = baltek.style.colors.BALL_BORDER;
    this.strokeStyleSelected = baltek.style.colors.BALL_BORDER_SELECTED;

    this.text = "@";
}

baltek.draw.Ball.prototype.update = function(){
    baltek.debug.writeMessage( "Ball: at (" + this.box.ix + "," + this.box.iy + ") just updated!" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Footballer = function(teamIndex, force){
    this.$init(teamIndex, force);
}

baltek.utils.inherit(baltek.draw.Footballer, baltek.draw.Circle);

baltek.draw.Footballer.prototype.$init = function(teamIndex, force){
    baltek.draw.Footballer.super.$init.call(this);

    baltek.utils.assert( teamIndex === 0 || teamIndex === 1 );
    this.teamIndex = teamIndex

    this.text = force.toString();

    var teamColor = baltek.style.colors.TEAM_COLORS[this.teamIndex] ;
    this.fillStyle = teamColor ;
    this.fillStyleSelected = teamColor ;
    this.strokeStyle = teamColor;
    this.strokeStyleSelected = baltek.style.colors.CIRCLE_BORDER_SELECTED;
}

baltek.draw.Footballer.prototype.update = function(){
    baltek.debug.writeMessage( "Footballer: " + this.teamIndex + "." + this.text +
        " at (" + this.box.ix + "," + this.box.iy + ") just updated!" );
}
///////////////////////////////////////////////////////////////////////////////
