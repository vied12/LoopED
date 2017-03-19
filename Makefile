ifndef HOST
	HOST = "localhost:8000"
endif

ifndef DEV_MODE
	DEV_MODE = false
endif


ifndef NODE
	NODE = node
endif

run:
	. env/bin/activate ; \
	PYTHONPATH=src/ SETTINGS=settings.py DEV_MODE=$(DEV_MODE) HOST=$(HOST) \
	./webapp.py

pull:
	git pull

build:
	HOST=$(HOST) $(NODE) node_modules/webpack/bin/webpack.js

install:
	npm install
	. env/bin/activate ; pip install -r requirements.txt

start: build run

watch:
	HOST=$(HOST) $(NODE) node_modules/webpack/bin/webpack.js --watch

jump:
	. env/bin/activate ; PYTHONPATH=src/ ./src/looped/animations/jump.py test
