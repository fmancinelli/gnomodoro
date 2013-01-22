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
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Signals = imports.signals;
const St = imports.gi.St;

const Constants = Extension.imports.constants;
const Dialogs = Extension.imports.dialogs;
const Timer = Extension.imports.timer;
const Utils = Extension.imports.utils;

const Gnomodoro = new Lang.Class({
    Name: 'Gnomodoro',
    
    State: {
	DISABLED: 'DISABLED',
	SET_TASK: 'SET_TASK',
	FOCUS: 'FOCUS',
	BREAK: 'BREAK'
    },

    _init: function(params) {
	if(params) {
	    this._timerTickCallback = params.timerTickCallback;
	    this._stateChangeCallback = params.stateChangeCallback;	    
	}

	/* Initialize internal variables */
	this._pomodoroTime =  25 * 60;
	this._breakTime = 5 * 60;
	this._longBreakTime = 15 * 60;
	this._pomodori = 0;
	this._pomodoriInARow = 0;

	/* Create the timer */
	this._timer = new Timer.Timer();
	
	/* Create the task dialog */
	this._taskDialog = new Dialogs.TaskDialog();

	/* Set the initial state */
	this._currentState = Gnomodoro.prototype.State.DISABLED;

	/* Transition and action definitions */
	this._transitionAction = {};

	this._transitionAction[Gnomodoro.prototype.State.DISABLED] = {};
	this._transitionAction[Gnomodoro.prototype.State.DISABLED][Gnomodoro.prototype.State.DISABLED] = function() {};
	this._transitionAction[Gnomodoro.prototype.State.DISABLED][Gnomodoro.prototype.State.SET_TASK] = Lang.bind(this, this._disabledToSetTaskAction);
	
	this._transitionAction[Gnomodoro.prototype.State.SET_TASK] = {};
	this._transitionAction[Gnomodoro.prototype.State.SET_TASK][Gnomodoro.prototype.State.DISABLED] = function() {};
	this._transitionAction[Gnomodoro.prototype.State.SET_TASK][Gnomodoro.prototype.State.FOCUS] = Lang.bind(this, this._setTaskToFocusAction);

	this._transitionAction[Gnomodoro.prototype.State.FOCUS] = {};
	this._transitionAction[Gnomodoro.prototype.State.FOCUS][Gnomodoro.prototype.State.DISABLED] = Lang.bind(this, this._focusToDisabledAction);
	this._transitionAction[Gnomodoro.prototype.State.FOCUS][Gnomodoro.prototype.State.BREAK] = Lang.bind(this, this._focusToBreakAction);

	this._transitionAction[Gnomodoro.prototype.State.BREAK] = {};
	this._transitionAction[Gnomodoro.prototype.State.BREAK][Gnomodoro.prototype.State.DISABLED] = Lang.bind(this, this._breakToDisabledAction);
	this._transitionAction[Gnomodoro.prototype.State.BREAK][Gnomodoro.prototype.State.SET_TASK] = Lang.bind(this, this._breakToSetTaskAction);
    },

    setState: function(state) {
	this._setState(state);
    },
    
    _setState: function(state, callbackData) {
	if(!this._transitionAction[this._currentState]) {
	    throw new Error('No valid transitions from ' + this._currentState + ' found.');
	}

	if(!this._transitionAction[this._currentState][state]) {
	    throw new Error('No valid transitions from ' + this._currentState + ' to ' + state + ' found.');
	}

	this._transitionAction[this._currentState][state]();

	this._currentState = state;
	if(this._stateChangeCallback) {
	    this._stateChangeCallback(state, callbackData);
	}
    },

    _setTaskOpenDialog: function() {
	let message, task;
	
	if(this._pomodori > 0) {
	    if(this._pomodori == 1) {
		message = 'You have completed 1 pomodoro so far';
	    }
	    else {
		message = 'You have completed ' + this._pomodori + ' pomodori so far';
	    }

	    if(this._pomodoriInARow > 0) {
		task = this._currentTask;

		if(this._pomodoriInARow > 1) {
		    message = message + ' (...of which the last ' + this._pomodoriInARow + ' in a row)';
		}		
	    }
	}
	
	this._taskDialog.open({
	    message: message,
	    task: task,
	    closeCallback: Lang.bind(this, function(data) {
		if(data.status == Dialogs.TaskDialog.prototype.Status.CANCEL) {
		    this._setState(Gnomodoro.prototype.State.DISABLED);
		}
		else if(data.status == Dialogs.TaskDialog.prototype.Status.OK) {
		    this._currentTask = data.task;
		    this._setState(Gnomodoro.prototype.State.FOCUS, {
			task: data.task
		    });
		}
	    })
	});
    },

    _disabledToSetTaskAction: function() {
	this._pomodoriInARow = 0;
	this._setTaskOpenDialog();
    },

    _setTaskToFocusAction: function() {
	this._timer.stop(); // Should not be needed.	
	this._timer.start({
	    remainingTime: this._pomodoroTime,
	    timerTickCallback: Lang.bind(this, function(remainingTime) {
		if(this._timerTickCallback) {
		    this._timerTickCallback(this._currentState, remainingTime);
		}
	    }),
	    timerEndCallback: Lang.bind(this, function() {
		this._setState(Gnomodoro.prototype.State.BREAK);
	    })
	});

	Utils.showMessage('Have a nice pomodoro on ' + this._currentTask);
    },

    _focusToDisabledAction: function() {
	this._timer.stop();
    },

    _focusToBreakAction: function() {
	this._pomodori++;
	this._pomodoriInARow++;

	let breakTime = this._breakTime;	
	if((this._pomodoriInARow % 4) == 0) {
	    breakTime = this._longBreakTime;
	}
	
	this._timer.stop(); // Should not be needed.
	this._timer.start({
	    remainingTime: breakTime,
	    timerTickCallback: Lang.bind(this, function(remainingTime) {
		if(this._timerTickCallback) {
		    this._timerTickCallback(this._currentState, remainingTime);
		}
	    }),
	    timerEndCallback: Lang.bind(this, function() {
		this._setState(Gnomodoro.prototype.State.SET_TASK);
	    })
	});

	if((this._pomodori % 4) == 0) {
	    Utils.showMessage('You did 4 pomodori! Time for a longer break.');
	}
	else {
	    Utils.showMessage('The pomodoro is over... Now take a break!');
	}
    },

    _breakToDisabledAction: function() {
	this._timer.stop();
    },

    _breakToSetTaskAction: function() {
	this._timer.stop();
	this._setTaskOpenDialog();
    },
    
    destroy: function() {
	this._taskDialog.destroy();
	this._timer.destroy();
    }    
});

const Indicator = new Lang.Class({
    Name: 'Gnomodoro indicator',
    Extends: PanelMenu.Button,

    _init: function() {
	this.parent(St.Align.START);

	/* Build the indicator UI */
	let boxLayout = new St.BoxLayout();
	let icon = new St.Icon({
	    gicon: Constants.pomodoroSmallGIcon,
	    style_class: 'system-status-icon'
	});
	boxLayout.add(icon);

	this._timerLabel = new St.Label({
	    styleClass: 'indicator-label'
	});
	this._timerLabel.hide();
	boxLayout.add(this._timerLabel);
	
	this._taskLabel = new St.Label({
	    styleClass: 'indicator-label'
	});
	this._taskLabel.hide();
	boxLayout.add(this._taskLabel);

	this.actor.add_actor(boxLayout);

	/* Build the indicator menu */
	let pomodoroModeMenuItem = new PopupMenu.PopupSwitchMenuItem('Pomodoro mode', false, { style_class: 'popup-subtitle-menu-item' });
	pomodoroModeMenuItem.connect('toggled', Lang.bind(this, function() {
	    this._setPomodoroMode(pomodoroModeMenuItem.state);
	}));
	this.menu.addMenuItem(pomodoroModeMenuItem);

	/* Separator */
	this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
		
	/* Build the Gnomodoro object */
	this._gnomodoro = new Gnomodoro({
	    timerTickCallback: Lang.bind(this, function(state, remainingTime) {
		this._timerLabel.set_text('(' + Utils.formatTime(remainingTime) + ')');
	    }),	    
	    stateChangeCallback: Lang.bind(this, function(state, data) {
		if(state == Gnomodoro.prototype.State.DISABLED) {
		    pomodoroModeMenuItem.setToggleState(false);
		    this._taskLabel.hide();
		    this._timerLabel.hide();
		}
		else if(state == Gnomodoro.prototype.State.FOCUS) {
		    this._taskLabel.show();
		    this._taskLabel.set_text(data.task);

		    this._timerLabel.show();

		}
		else if(state == Gnomodoro.prototype.State.BREAK) {
		    this._taskLabel.set_text('Break!');
		}
	    })
	});

	/* Handle the destroy signal */
	this.connect('destroy', Lang.bind(this, this._onDestroy));	
    },

    _setPomodoroMode: function(pomodoroMode) {
	if(pomodoroMode == true) {
	    this._gnomodoro.setState(Gnomodoro.prototype.State.SET_TASK);
	}
	else {
	    this._gnomodoro.setState(Gnomodoro.prototype.State.DISABLED);
	}
    },

    _onDestroy: function() {
	this._gnomodoro.destroy();
    }    
});


