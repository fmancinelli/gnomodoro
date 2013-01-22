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
const Main = imports.ui.main;
const St = imports.gi.St;
const Tweener = imports.ui.tweener;

function showMessage(message) {
    let text = new St.Label({
	style_class: 'message',
	text: message
    });
    
    Main.uiGroup.add_actor(text);
    
    text.opacity = 255;
    
    let monitor = Main.layoutManager.primaryMonitor;
    
    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));
    
    
    Tweener.addTween(text,
                     { opacity: 0,
                       time: 3,
                       transition: 'easeInOutCubic',
                       onComplete: function() {
			   Main.uiGroup.remove_actor(text);
			   text = null;
		       }});
}

function formatTime(time) {
    // See http://stackoverflow.com/questions/4228356/integer-division-in-javascript
    let minutes = ~~(time/60);
    let seconds = time % 60;

    if(minutes < 10) {
	minutes = '0' + minutes;
    }

    if(seconds < 10) {
	seconds = '0' + seconds;
    }

    return minutes + ':' + seconds;
}

