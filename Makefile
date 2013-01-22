dist: clean
	mkdir dist
	(cd dist; zip -qr gnomodoro@mancinelli.me.zip ../src/*)
clean:
	rm -rf dist