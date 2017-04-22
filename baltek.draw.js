"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw = { initCalled: false };

baltek.draw.$init = function(){
    if ( ! baltek.draw.initCalled ) {
        baltek.draw.initCalled = true;

        // Init any package used by this one
        baltek.color.$init();

        baltek.draw.canvas = document.getElementById( "Baltek_CanvasZone_Canvas" );
        baltek.draw.rectangle = baltek.draw.canvas.getBoundingClientRect();
        baltek.draw.drawer = baltek.draw.canvas.getContext( "2d" );
    }
}

baltek.draw.getMousePosition = function(event){
    return {
      x: event.clientX + window.pageXOffset - baltek.draw.rectangle.left,
      y: event.clientY + window.pageYOffset - baltek.draw.rectangle.top
    };
}

baltek.draw.setDimensions = function(nx, ny){
    baltek.draw.boxQuantum = Math.min(
        (baltek.draw.rectangle.right  - baltek.draw.rectangle.left)/nx,
        (baltek.draw.rectangle.bottom - baltek.draw.rectangle.top )/ny) ;

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
baltek.draw.Box = function(ix, iy, boxKind){
    this.$init(ix, iy, boxKind);
}

baltek.utils.inherit(baltek.draw.Box, baltek.draw.Selectable);

baltek.draw.Box.prototype.$init = function(ix, iy, boxKind){
    baltek.draw.Box.super.$init.call(this);

    this.ix = ix;
    this.iy = iy;
    this.boxKind = boxKind;

    this.x = this.ix * baltek.draw.boxSide;
    this.y = this.iy * baltek.draw.boxSide;
    this.side = baltek.draw.boxSide;

    this.fillStyle = baltek.color.GREEN_2;
    this.fillStyleSelected = baltek.color.GREEN_2;
    if ( (this.ix + this.iy) % 2 === 0) {
        this.fillStyle = baltek.color.GREEN_1;
        this.fillStyleSelected = baltek.color.GREEN_1;
    }
    this.strokeStyle = this.fillStyle;
    this.strokeStyleSelected = baltek.color.YELLOW;
}

baltek.draw.Box.prototype.contains = function(point){
    var contains = (point.x > this.x) && (point.x < (this.x + this.side)) &&
                   (point.y > this.y) && (point.y < (this.y + this.side));
    return contains;
}

baltek.draw.Box.prototype.draw = function(){
    baltek.draw.drawer.strokeStyle = this.strokeStyle;
    baltek.draw.drawer.fillStyle = this.fillStyle;
    baltek.draw.drawer.lineWidth = 5;

    if ( this.selectable ) {
        baltek.draw.drawer.strokeStyle = this.strokeStyleSelected;
        baltek.draw.drawer.fillStyle = this.fillStyleSelected;
    }

    var lw = baltek.draw.drawer.lineWidth;
    baltek.draw.drawer.strokeRect(this.x + lw/2, this.y +lw/2, this.side -lw, this.side - lw);
    baltek.draw.drawer.fillRect(this.x + lw/2,this.y +lw/2, this.side - lw, this.side - lw);
}

baltek.draw.Box.prototype.update = function(){
    baltek.debug.writeMessage( "Box: (" + this.ix + "," + this.iy + ") just updated!" );
}
///////////////////////////////////////////////////////////////////////////////
