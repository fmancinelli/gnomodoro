/*
 * Gnomodoro. A pomodoro timer for Gnome Shell
 * Copyright (C) 2013 Fabio Mancinelli <fabio@mancinelli.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Lang = imports.lang;
const MainLoop = imports.mainloop;

const Timer = new Lang.Class({
    Name: 'Timer',

    _init: function() {
    },

    start: function(params) {
	if(this._timeoutId) {
	    return false;
	}

	if(!params) {
	    return false;
	}

	if(!params.remainingTime) {
	    return false;
	}

	this._remainingTime = params.remainingTime;
	this._timerTickCallback = params.timerTickCallback;
	this._timerEndCallback = params.timerEndCallback;
	this._timeoutId = MainLoop.timeout_add(1000, Lang.bind(this, this._timerFunction));

	/* Send the first tick callback for the timer start */
	if(this._timerTickCallback) {
	    this._timerTickCallback(this._remainingTime);
	}

	return true;
    },

    _timerFunction: function() {
	this._remainingTime--;
	
	if(this._remainingTime < 0) {
	    /* Save the timerEndCallback if it exists and elapsed time */
	    let timerEndCallback = this._timerEndCallback;

	    this.stop();

	    if(timerEndCallback) {
		timerEndCallback();
	    }

	    return false;
	}

	if(this._timerTickCallback) {
	    this._timerTickCallback(this._remainingTime);
	}

	return true;
    },

    stop: function() {
	if(!this._timeoutId) {
	    return false;
	}

	MainLoop.source_remove(this._timeoutId);
	this._timeoutId = null;
	this._remainingTime = null;
	this._timerTickCallback = null;
	this._timerEndCallback = null;

	return true;
    },

    isStarted: function() {
	if(this._timeoutId) {
	    return true;
	}
	else {
	    return false;
	}
    },
	    	
    destroy: function() {
	this.stop();
    }
});
