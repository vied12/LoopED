#!/usr/bin/env python
from flask import Flask, render_template, make_response, request
import uuid
from Led import create_led
from animations import JumpGame
from gamepads import WebGamePad

app = Flask(__name__)
led = create_led(dev=False)
gamepad = WebGamePad()
jumpGame = None
state = {
    'players': []
}


@app.route('/')
def connectJump():
    global jumpGame
    token = request.cookies.get('token')
    if not token or token not in state['players']:
        token = str(uuid.uuid4())
        state['players'].append(token)
    resp = make_response(render_template('index.html', token=token))
    resp.set_cookie('token', token)
    if jumpGame:
        jumpGame.stopThread()
    jumpGame = JumpGame(led=led, gamepad=gamepad, players=state['players'])
    jumpGame.run(sleep=25, threaded=True)
    return resp


@app.route('/jump', methods=['POST'])
def jump():
    token = request.cookies.get('token')
    gamepad.click(token)
    return 'ok'


if __name__ == '__main__':
    app.run()
