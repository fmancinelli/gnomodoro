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
const Gio = imports.gi.Gio;

const pomodoroSmallGIcon = new Gio.FileIcon({
    file: Gio.File.new_for_path(Extension.dir.get_child('images/pomodoro_small.png').get_path())
});

const pomodoroGIcon = new Gio.FileIcon({
    file: Gio.File.new_for_path(Extension.dir.get_child('images/pomodoro.png').get_path())
});
