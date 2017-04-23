"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw = { $initCalled: false };

baltek.draw.$init = function(){
    if ( ! baltek.draw.$initCalled ) {
        baltek.draw.$initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
        baltek.style.$init();

        baltek.draw.canvas = document.getElementById( "Baltek_CanvasZone_Canvas" );
        baltek.draw.rectangle = baltek.draw.canvas.getBoundingClientRect();
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
    return {
      x: event.clientX + window.pageXOffset - baltek.draw.rectangle.left,
      y: event.clientY + window.pageYOffset - baltek.draw.rectangle.top
    };
}

baltek.draw.setBoxLatticeDimensions = function(nx, ny){
    baltek.draw.nx = nx;
    baltek.draw.ny = ny;

    // From the lattice dimension (nx, ny) computes the boxSide, etc.
    baltek.draw.boxQuantum = Math.min(
        (baltek.draw.rectangle.right  - baltek.draw.rectangle.left)/baltek.draw.nx,
        (baltek.draw.rectangle.bottom - baltek.draw.rectangle.top )/baltek.draw.ny ) ;

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

    this.ix = ix;
    this.iy = iy;
    this.xyLabel = xyLabel;
    this.doShowXYLabel = false;

    this.x = this.ix * baltek.draw.boxSide;
    this.y = this.iy * baltek.draw.boxSide;
    this.side = baltek.draw.boxSide;

    this.fillStyle = baltek.style.colors.GREEN_2;
    this.fillStyleSelected = baltek.style.colors.GREEN_2;
    if ( (this.ix + this.iy) % 2 === 0 ) {
        this.fillStyle = baltek.style.colors.GREEN_1;
        this.fillStyleSelected = baltek.style.colors.GREEN_1;
    }
    this.strokeStyle = this.fillStyle;
    this.strokeStyleSelected = baltek.style.colors.YELLOW;
}

baltek.draw.Box.prototype.contains = function(point){
    var contains = (point.x > this.x) && (point.x < (this.x + this.side)) &&
                   (point.y > this.y) && (point.y < (this.y + this.side));
    return contains;
}

baltek.draw.Box.prototype.draw = function(){
    baltek.draw.drawer.strokeStyle = this.strokeStyle;
    baltek.draw.drawer.fillStyle = this.fillStyle;
    baltek.draw.drawer.lineWidth = baltek.style.LINE_WIDTH;

    if ( this.selectable ) {
        baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
        baltek.draw.drawer.fillStyle = this.fillStyleSelected;
    }

    var lw = baltek.draw.drawer.lineWidth;
    baltek.draw.drawer.strokeRect(this.x + lw/2, this.y +lw/2, this.side -lw, this.side - lw);
    baltek.draw.drawer.fillRect(this.x + lw/2,this.y +lw/2, this.side - lw, this.side - lw);


    if ( this.xyLabel != null ) {
        if ( this.doShowXYLabel ) {
            baltek.draw.drawer.fillStyle = baltek.style.colors.WHITE;
        } else {
            baltek.draw.drawer.fillStyle = this.fillStyle;
        }
        baltek.draw.drawer.font = baltek.style.XY_LABEL_FONT;
        baltek.draw.drawer.textBaseline = "bottom";
        baltek.draw.drawer.textAlign = "start";
        baltek.draw.drawer.fillText(this.xyLabel, this.x + this.side/16, this.y + this.side*(1 - 1/16));
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
