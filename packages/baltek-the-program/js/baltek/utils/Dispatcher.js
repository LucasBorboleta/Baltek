"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.utils.Dispatcher = function(){
    this.__initObject();
};

baltek.utils.Dispatcher.__initClassCalled = false;

baltek.utils.Dispatcher.__initClass = function(){

    if ( baltek.utils.Dispatcher.__initClassCalled ) return;
    baltek.utils.Dispatcher.__initClassCalled = true;

    baltek.utils.Dispatcher.__instance = null;

    baltek.utils.inherit(baltek.utils.Dispatcher, Object);

    baltek.utils.Dispatcher.prototype.__initObject = function(){
        this.updater = null;
        this.locked = false;
        this.waitingNotifiers = [];
        this.loopedNotifiers = [];
    };

    baltek.utils.Dispatcher.prototype.callNotifiers = function(){
        if ( this.locked ) return;

        this.loopedNotifiers = this.waitingNotifiers;
        this.waitingNotifiers = [];

        var notifier = null;
        while ( this.loopedNotifiers.length !== 0 ) {
            notifier = this.loopedNotifiers.shift();
            notifier();
        }
        baltek.utils.assert( this.loopedNotifiers.length === 0 );
    };

    baltek.utils.Dispatcher.getInstance = function(){
        if ( baltek.utils.Dispatcher.__instance === null ) {
            baltek.utils.Dispatcher.__instance = new baltek.utils.Dispatcher();
        }
        return baltek.utils.Dispatcher.__instance;
    };

    baltek.utils.Dispatcher.prototype.lock = function(){
        baltek.utils.assert( ! this.locked );
        this.locked = true;
    };

    baltek.utils.Dispatcher.prototype.registerNotifier = function(notifier){
        baltek.utils.assert( this.locked );
        this.waitingNotifiers.push(notifier);
    };

    baltek.utils.Dispatcher.prototype.resetNotifiers = function(){
        baltek.utils.assert( ! this.locked );
        this.waitingNotifiers = [];
        this.loopedNotifiers = [];
    };

    baltek.utils.Dispatcher.prototype.start = function(){
        // Each "milliseconds" call the registered notifiers
        var milliseconds = 1;
        var thisSaved = this;
        var thisSavedCallNotifiers = function(){ thisSaved.callNotifiers(); };
        this.updater = window.setInterval(thisSavedCallNotifiers, milliseconds);
    };

    baltek.utils.Dispatcher.prototype.stop = function(){
        window.clearInterval(this.updater);
    };

    baltek.utils.Dispatcher.prototype.unlock = function(){
        baltek.utils.assert( this.locked );
        this.locked = false;
    };
};
///////////////////////////////////////////////////////////////////////////////
