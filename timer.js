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
    }

    start: function(params) {
	if(this._timeoutId) {
	    return;
	}

	if(!params) {
	    return;
	}

	if(!params.endTime) {
	    return;
	}

	this._elapsedTime = 0;
	this._endTime = params.endTime;
	this._tickCallback = params.tickCallback;
	this._timerEndCallback = params.timerEndCallback;
	this._timeoutId = MainLoop.timeout_add(1000, Lang.bind(this, this._timerFunction));
    }

    _timerFunction: function() {
	this._elapsedTime++;

	if(this._elapsedTime >= this._endTime) {
	    if(this._timerEndCallback) {
		this._timerEndCallback(this._elapsedTime);
	    }
	    this.stop();

	    return false;
	}

	if(this._tickCallback) {
	    this._tickCallback(this._elapsedTime);
	}

	return true;
    }

    stop: function() {
	if(!this._timeoutId) {
	    return;
	}

	MainLoop.source_remove(this._timeoutId);
	this._timeoutId = null;
	this._elapsedTime = null;
	this._endTime = null;
	this._tickCallback = null;
	this._timerEndCallback = null;
    }
	

    destroy: function() {
	this.stop();
    }
});
