#!/usr/bin/env python
from flask import Flask, render_template, make_response, request
import uuid
from Led import create_led
from animations import Jump
from gamepads import WebGamePad
import os
app = Flask(__name__)
app.config.from_envvar('SETTINGS')
led = create_led(dev=os.environ.get('DEV_MODE', False))
gamepad = WebGamePad()

state = {
    'jumpGame': None,
    'players': []
}


@app.route('/')
def gameList():
    return render_template('index.html')


@app.route('/jump', methods=['POST'])
def connectJump():
    global state
    token = request.cookies.get('token')
    if not token or token not in state['players']:
        token = str(uuid.uuid4())
        state['players'].append(token)
    resp = make_response()
    resp.set_cookie('token', token)
    if state['jumpGame']:
        state['jumpGame'].stopThread()
    state['jumpGame'] = Jump(led, gamepad=gamepad, players=state['players'])
    state['jumpGame'].run(threaded=True, max_cycles=1)
    return resp


@app.route('/controller', methods=['POST'])
def controller():
    token = request.cookies.get('token')
    gamepad.click(token)
    return 'ok'


if __name__ == '__main__':
    app.run(host='0.0.0.0')
