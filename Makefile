ifndef PORT
	PORT = 8000
endif
ifndef HOST
	HOST = "localhost:$(PORT)"
endif

ifndef DEV_MODE
	DEV_MODE = false
endif


ifndef NODE
	NODE = node
endif

run:
	SETTINGS=../settings.py DEV_MODE=$(DEV_MODE) HOST=$(HOST) \
	pipenv run src/webapp.py

prod:
	sudo SETTINGS=../settings.py DEV_MODE=$(DEV_MODE) `pipenv --venv`/bin/gunicorn -b 0.0.0.0:80 -k flask_sockets.worker webapp:app --chdir src

pull:
	git pull

build:
	HOST=$(HOST) $(NODE) node_modules/webpack/bin/webpack.js

install:
	sudo apt-get install portaudio19-dev
	npm run build
	pipenv sync

start: pull install build run

watch:
	HOST=$(HOST) $(NODE) node_modules/webpack/bin/webpack.js --watch

jump:
	. env/bin/activate ; PYTHONPATH=src/ ./src/looped/animations/jump.py test
