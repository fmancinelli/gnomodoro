# Gnomodoro

Gnomodoro is a [Gnome Shell](http://www.gnome.org/gnome-3/) extension that implements a timer that helps the user to put into practice the [Pomodoro Technique](http://www.pomodorotechnique.com/).

> The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down periods of work into 25-minute intervals called 'Pomodori' (from the Italian word for 'tomatoes') separated by breaks.

> There are five basic steps to implementing the technique:

> * Decide on the *task* to be done
> * Set the *pomodoro* (timer) to 25 minutes
> * Work on the task until the timer rings
> * Take a *short break* (3 to 5 minutes)
> * Every four *pomodori* take a *longer break* (15 to 30 minutes)
>
> Source: [Wikipedia](http://en.wikipedia.org/wiki/Pomodoro_technique)

## Installation

### From the Gnome Extensions site

1. Gnomodoro is available here for automatic installation: [https://extensions.gnome.org/extension/587/gnomodoro/](https://extensions.gnome.org/extension/587/gnomodoro/)

### From the sources

1. Download or clone this repository (or one of its tags)

2. Build and install by running `make install`

3. Restart Gnome Shell using `ALT-F2` and then `r`
   
4. Enable the extension by using the `gnome-tweak-tool` (in the *Shell extensions* tab)

## Usage

* Once enabled, Gnomodoro will appear in the top bar:

![Pomodoro indicator](https://raw.github.com/fmancinelli/gnomodoro/master/images/indicator-menu.png)

* By activating the *pomodoro mode* you will enter in the loop described earlier. First you will have to define a task to work on:

![Pomodoro indicator](https://raw.github.com/fmancinelli/gnomodoro/master/images/set-task.png)

* Then a 25 minutes *pomodoro* starts:

![Pomodoro indicator](https://raw.github.com/fmancinelli/gnomodoro/master/images/indicator-pomodoro.png)

* At the end of the *pomodoro*, a message will tell you to take a break:

![Pomodoro indicator](https://raw.github.com/fmancinelli/gnomodoro/master/images/break.png)

* A 5-minute break starts immediately after:

![Pomodoro indicator](https://raw.github.com/fmancinelli/gnomodoro/master/images/indicator-break.png)

* At the end of the break, another *pomodoro* will be started by asking what the next task will be.

* After having completed 4 *pomodori* in a row, there will be a longer break of 15 minutes.

* At any time you can disable the *pomodoro mode* by using the menu.

## Credits

Thanks to [Ashish Saini](http://blog.ashfame.com/2011/04/pomodoro-timer-in-ubuntu/) for the pomodoro icon.

## Changelog

* **Version 1.0**

  Initial release
