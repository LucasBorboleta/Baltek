"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Square = function(ix, iy, xyLabel, text){
    this.__initObject(ix, iy, xyLabel, text);
};

baltek.draw.Square.__initClassCalled = false;

baltek.draw.Square.__initClass = function(){

    if ( baltek.draw.Square.__initClassCalled ) return;
    baltek.draw.Square.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Square, baltek.draw.Selectable);

    baltek.draw.Square.prototype.__initObject = function(ix, iy, xyLabel, text){
        baltek.draw.Square.super.__initObject.call(this);

        this.ball = null ;
        this.footballers = [] ;
        this.footballers.push(null);
        this.footballers.push(null);

        this.ix = ix;
        this.iy = iy;
        this.xyLabel = xyLabel;
        this.doShowXYLabel = false;
        this.text = text;

        this.x = this.ix * baltek.draw.squareSide;
        this.y = this.iy * baltek.draw.squareSide;
        this.side = baltek.draw.squareSide;

        this.fillStyle = baltek.style.colors.SQUARE_1;
        this.fillStyleSelected = baltek.style.colors.SQUARE_1;
        if ( (this.ix + this.iy) % 2 === 0 ) {
            this.fillStyle = baltek.style.colors.SQUARE_0;
            this.fillStyleSelected = baltek.style.colors.SQUARE_0;
        }
        this.strokeStyle = this.fillStyle;
        this.strokeStyleSelected = baltek.style.colors.SQUARE_BORDER_SELECTED;
    };

    baltek.draw.Square.prototype.clear = function(){

        if ( this.ball !== null ) {
            this.ball.square = null;
            this.ball = null;
        }

        if ( this.footballers[0] !== null ) {
            this.footballers[0].square = null;
            this.footballers[0] = null;
        }

        if ( this.footballers[1] !== null ) {
            this.footballers[1].square = null;
            this.footballers[1] = null;
        }

        this.draw();
    };

    baltek.draw.Square.prototype.contains = function(point){
        var contains = (point.x > this.x) && (point.x < (this.x + this.side)) &&
                       (point.y > this.y) && (point.y < (this.y + this.side));
        return contains;
    };

    baltek.draw.Square.prototype.distributeBallAndFootballers = function(){
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

    baltek.draw.Square.prototype.draw = function(){
        baltek.draw.drawer.strokeStyle = this.strokeStyle;
        baltek.draw.drawer.fillStyle = this.fillStyle;
        baltek.draw.drawer.lineWidth = baltek.style.widths.SQUARE_BORDER;

        if ( this.selectable ) {
            baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
            baltek.draw.drawer.fillStyle = this.fillStyleSelected;
        }

        var lw = baltek.draw.drawer.lineWidth;
        baltek.draw.drawer.strokeRect(this.x + lw/2, this.y +lw/2, this.side -lw, this.side - lw);
        baltek.draw.drawer.fillRect(this.x + lw/2,this.y +lw/2, this.side - lw, this.side - lw);


        if ( this.xyLabel != null ) {
            if ( this.doShowXYLabel ) {
                baltek.draw.drawer.fillStyle = baltek.style.colors.SQUARE_TEXT;
            } else {
                baltek.draw.drawer.fillStyle = this.fillStyle;
            }
            baltek.draw.drawer.font = baltek.style.fonts.SQUARE_TEXT;
            baltek.draw.drawer.textBaseline = "bottom";
            baltek.draw.drawer.textAlign = "start";
            baltek.draw.drawer.fillText(this.xyLabel, this.x + this.side/16, this.y + this.side*(1 - 1/16));
        }

        if ( this.text !== "" ) {
            baltek.draw.drawer.fillStyle = baltek.style.colors.SQUARE_TEXT;
            baltek.draw.drawer.font = baltek.style.fonts.SQUARE_TEXT;
            baltek.draw.drawer.textBaseline = "middle";
            baltek.draw.drawer.textAlign = "center";
            baltek.draw.drawer.fillText(this.text, this.x + this.side/2, this.y + this.side/2);
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
    };

    baltek.draw.Square.prototype.setBall = function(ball){
        baltek.utils.assert( ball !== null );

        if ( this.ball !== ball ) {
            baltek.utils.assert( this.ball === null );

            if ( ball.square !== null ) {
                ball.square.ball = null;
                ball.square.draw();
            }

            ball.square = this;
            this.ball = ball;
            this.draw();
        }
    };

    baltek.draw.Square.prototype.setFootballer = function(footballer){
        baltek.utils.assert( footballer !== null );

        if ( this.footballers[footballer.teamIndex] !== footballer ) {
            baltek.utils.assert( this.footballers[footballer.teamIndex] === null );

            if ( footballer.square !== null ) {
                footballer.square.footballers[footballer.teamIndex] = null;
                footballer.square.draw();
            }

            footballer.square = this;
            this.footballers[footballer.teamIndex] = footballer;
            this.draw();
        }
    };

    baltek.draw.Square.prototype.showXYLabel = function(condition){
        this.doShowXYLabel = condition;
        this.draw();
    };
};
///////////////////////////////////////////////////////////////////////////////
