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
	sudo SETTINGS=../settings.py DEV_MODE=$(DEV_MODE) `pipenv --venv`/bin/python `pipenv --venv`/bin/gunicorn -w 1 -b 0.0.0.0:80 -k flask_sockets.worker webapp:app --chdir src -p ../app.pid

restart:
	sudo kill -HUP `cat app.pid`

build:
	REACT_APP_HOST=master.ring npm run build

pull:
	git pull

install:
	sudo apt-get install portaudio19-dev
	npm run build
	pipenv sync

start: pull install build run

watch:
	HOST=$(HOST) $(NODE) node_modules/webpack/bin/webpack.js --watch

jump:
	. env/bin/activate ; PYTHONPATH=src/ ./src/looped/animations/jump.py test
