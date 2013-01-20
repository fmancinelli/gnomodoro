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
const St = imports.gi.St;

const Constants = Extension.imports.constants;

const Indicator = new Lang.Class({
    Name: 'Gnomodoro indicator',
    Extends: PanelMenu.Button,

    _init: function() {
	this.parent(St.Align.START);

	/* Build the indicator UI */
	let boxLayout = new St.BoxLayout();
	let icon = new St.Icon({
	    gicon: Constants.pomodoroSmallGIcon,
	    //icon_name: 'system-run-symbolic',
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
	
	this.connect('destroy', Lang.bind(this, this._onDestroy));
    },

    _setPomodoroMode: function(pomodoroMode) {
	if(pomodoroMode == true) {
	    log('Enable pomodoro mode');
	}
	else {
	    log('Disable pomodoro mode');
	}
    },

    _onDestroy: function() {
	log('Destroy!');
    }    
});


