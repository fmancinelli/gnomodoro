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
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Lang = imports.lang;
const ModalDialog = imports.ui.modalDialog;
const St = imports.gi.St;

const Constants = Extension.imports.constants;

const TaskDialog = Lang.Class({
    Name: 'Task dialog',
    Extends: ModalDialog.ModalDialog,

    Status: {
	OK: 'OK',
	CANCEL: 'CANCEL'
    },

    _init: function() {
	this.parent({
	    styleClass: 'taskDialog'
	});

	let horizontalBoxLayout = new St.BoxLayout();

	let icon =  new St.Icon({
	    gicon: Constants.pomodoroGIcon,
	    styleClass: 'taskDialog-icon'
	});	
	horizontalBoxLayout.add(icon);

	let verticalBoxLayout = new St.BoxLayout({
	    vertical: true
	});
		
        let label = new St.Label({
	    text: 'Please enter the task for the next pomodoro:'
	});
	verticalBoxLayout.add(label);

	this._entry = new St.Entry({
	    styleClass: 'taskDialog-entry'
	});
	verticalBoxLayout.add(this._entry);

	this._message = new St.Label({
	    styleClass: 'taskDialog-message'
	});
	verticalBoxLayout.add(this._message);

	horizontalBoxLayout.add(verticalBoxLayout);

        this.contentLayout.add(horizontalBoxLayout, { y_align: St.Align.START });

	let entryText = this._entry.clutter_text;
        this.setInitialKeyFocus(entryText);

	entryText.connect('key-press-event', Lang.bind(this, function(o, e) {
            let symbol = e.get_key_symbol();
            if (symbol == Clutter.Return || symbol == Clutter.KP_Enter) {		
                this.close();

		let task = this._entry.get_text();
		
		if(this._closeCallback) {
		    if(task == '') {
			this._closeCallback({
			    status: TaskDialog.prototype.Status.CANCEL,		
			});
		    }
		    else {
			this._closeCallback({
			    status: TaskDialog.prototype.Status.OK,
			    task: task
			});
		    }
		}
		
                return true;
            }
	    
            if (symbol == Clutter.Escape) {
                this.close();

		if(this._closeCallback) {
		    this._closeCallback({
			status: TaskDialog.prototype.Status.CANCEL
		    });
		}
		
                return true;
            }
	    
            return false;
        }));	
    },

    open: function(params) {
	if(!params) {
	    params = {}
	}

	this._closeCallback = params.closeCallback;
	this._entry.set_text(params.task || '');
	if(params.message) {
	    this._message.show();
	    this._message.set_text(params.message);
	}
	else {
	    this._message.hide();
	}
	
	this.parent();
    }
});
