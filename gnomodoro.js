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
	    this._stateChangeCallback = params.stateChangeCallback;
	}
	
	/* Create the task dialog */
	this._taskDialog = new Dialogs.TaskDialog();

	/* Set the initial state */
    	this.setState(Gnomodoro.prototype.State.DISABLED);
    },

    setState: function(state) {
	switch(state) {
	case Gnomodoro.prototype.State.DISABLED: {
	    this.state = Gnomodoro.prototype.State.DISABLED;
	    if(this._stateChangeCallback) {
		this._stateChangeCallback({
		    state: Gnomodoro.prototype.State.DISABLED
		});
	    }
	    
	    break;
	}

	case Gnomodoro.prototype.State.SET_TASK: {
	    this.state = Gnomodoro.prototype.State.SET_TASK;
	    if(this._stateChangeCallback) {
		this._stateChangeCallback({
		    state: Gnomodoro.prototype.State.SET_TASK
		});
	    }

	    this._taskDialog.open({
		closeCallback: Lang.bind(this, function(data) {
		    if(data.status == Dialogs.TaskDialog.prototype.Status.CANCEL) {
			this.setState(Gnomodoro.prototype.State.DISABLED);
		    }		
		})
	    });

	    
	    break;
	}

	case Gnomodoro.prototype.State.FOCUS: {		
	    this.state = Gnomodoro.prototype.State.FOCUS;
	    if(this._stateChangeCallback) {
		this._stateChangeCallback({
		    state: Gnomodoro.prototype.State.FOCUS
		});
	    }
	    
	    break;
	}

	case Gnomodoro.prototype.State.BREAK: {
	    this.state = Gnomodoro.prototype.State.BREAK;
	    if(this._stateChangeCallback) {
		this._stateChangeCallback({
		    state: Gnomodoro.prototype.State.BREAK
		});
	    }

	    break;
	}	    
	}		
    },
    
    destroy: function() {
	this._taskDialog.destroy();
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
	
	this.actor.add_actor(boxLayout);

	/* Build the indicator menu */
	let pomodoroModeMenuItem = new PopupMenu.PopupSwitchMenuItem(_('Pomodoro mode'), false, { style_class: 'popup-subtitle-menu-item' });
	pomodoroModeMenuItem.connect('toggled', Lang.bind(this, function() {
	    this._setPomodoroMode(pomodoroModeMenuItem.state);
	}));
	this.menu.addMenuItem(pomodoroModeMenuItem);
	

	/* Build the Gnomodoro object */
	this._gnomodoro = new Gnomodoro({
	    stateChangeCallback: Lang.bind(this, function(data) {
		if(data.state == Gnomodoro.prototype.State.DISABLED) {
		    pomodoroModeMenuItem.setToggleState(false);
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
    },

    _onDestroy: function() {
	this._gnomodoro.destroy();
    }    
});


