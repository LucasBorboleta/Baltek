"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.draw.Ball = function(){
    this.__initObject();
};

baltek.draw.Ball.__initClassCalled = false;

baltek.draw.Ball.__initClass = function(){

    if ( baltek.draw.Ball.__initClassCalled ) return;
    baltek.draw.Ball.__initClassCalled = true;

    baltek.utils.inherit(baltek.draw.Ball, baltek.draw.Disk);

    baltek.draw.Ball.prototype.__initObject = function(){
        baltek.draw.Ball.super.__initObject.call(this);

        this.fillStyle = baltek.style.colors.BALL_BACKGROUND ;
        this.fillStyleSelected = baltek.style.colors.BALL_BACKGROUND_SELECTED;
        this.strokeStyle = baltek.style.colors.BALL_BORDER;
        this.strokeStyleSelected = baltek.style.colors.BALL_BORDER_SELECTED;

        this.text = "@";
    };
};
///////////////////////////////////////////////////////////////////////////////
