init:
	npm install --legacy-peer-deps

build:
	npm run build && rm -rf app && sudo zip -r app.zip dist