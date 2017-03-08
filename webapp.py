#!/usr/bin/env python
from flask import Flask, render_template, make_response, request
import json
import uuid
from Led import create_led
from animations import Jump
from gamepads import WebGamePad
from flask_sockets import Sockets
import os
import geventwebsocket
import gevent

app = Flask(__name__)
app.config.from_envvar('SETTINGS')
led = create_led(dev=os.environ.get('DEV_MODE', False))
gamepad = WebGamePad()
sockets = Sockets(app)

state = {
    'jumpGame': None,
    'players': [],
    'ws': [],
}


@sockets.route('/jump')
def echo_socket(ws):
    state['ws'].append(ws)
    while not ws.closed:
        ws.receive()


@sockets.route('/start')
def restart_socket(ws):
    state['ws'].append(ws)
    while not ws.closed:
        gevent.sleep(3)
        ws.receive()


@app.route('/')
def gameList():
    return render_template('index.html')


def send_notifs(msg):
    for ws in state['ws']:
        try:
            ws.send(msg)
        except geventwebsocket.WebSocketError:
            state['ws'].remove(ws)


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
        state['jumpGame'].stopThread(wait=True)
    state['jumpGame'] = Jump(
        led,
        gamepad=gamepad,
        players=state['players'],
        callback=lambda anim: send_notifs(json.dumps(anim)))
    state['jumpGame'].run(threaded=True, untilComplete=True)
    send_notifs('start')
    return resp


@app.route('/controller', methods=['POST'])
def controller():
    token = request.cookies.get('token')
    gamepad.click(token)
    return 'ok'


if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()
