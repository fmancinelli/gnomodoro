dist: clean
	mkdir dist
	(cd src; zip -qr ../dist/gnomodoro@mancinelli.me.zip .)
clean:
	rm -rf dist
install: dist
	unzip dist/gnomodoro@mancinelli.me -d ~/.local/share/gnome-shell/extensions/gnomodoro@mancinelli.me

