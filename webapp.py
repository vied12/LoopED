#!/usr/bin/env python
from flask import Flask, render_template, request, jsonify, abort
import json
import uuid
from Led import create_led
from animations import Jump
from gamepads import WebGamePad
from flask_sockets import Sockets
import os
import geventwebsocket
import gevent
from bibliopixel import colors
from geventwebsocket.handler import WebSocketHandler

COLORS = [
    colors.Orange,
    colors.Indigo,
    colors.Green,
    colors.Violet,
    colors.Olive,
    colors.Blue,
    colors.Yellow,
]


app = Flask(__name__)
app.config.from_envvar('SETTINGS')
led = create_led(dev=os.environ.get('DEV_MODE', False))
gamepad = WebGamePad()
sockets = Sockets(app)

app.state = {
    'jumpGame': None,
    'players': [],
    'ws': [],
    'playing': False,
}


@sockets.route('/jump')
def echo_socket(ws):
    app.state['ws'].append(ws)
    while not ws.closed:
        ws.receive()


@app.route('/')
def gameList():
    return render_template('index.html')


def send_notifs(msg):
    if type(msg) is dict:
        msg = json.dumps(msg)
    for ws in app.state['ws']:
        if ws.closed:
            app.state['ws'].remove(ws)
            continue
        try:
            ws.send(msg)
        except geventwebsocket.WebSocketError:
            app.state['ws'].remove(ws)


@app.route('/jump-connect', methods=['POST'])
def connectJump():
    token = request.cookies.get('token', str(uuid.uuid4()))
    player = next((_ for _ in app.state['players'] if _['token'] == token), None)
    if not player:
        player = {
            'token': token,
            'color': COLORS[len(app.state['players']) % len(COLORS)]
        }
        app.state['players'].append(player)
    data = {
        'players': app.state['players']
    }
    send_notifs({'type': 'join', 'payload': data})
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    response.set_cookie('token', player['token'])
    return response


@app.route('/jump-start', methods=['POST'])
def startJump():
    if app.state['playing']:
        return abort(400)
    if app.state['jumpGame']:
        app.state['jumpGame'].stopThread(wait=True)
    app.state['playing'] = True
    app.state['jumpGame'] = Jump(
        led,
        gamepad=gamepad,
        players=app.state['players'],
        onDie=lambda d: send_notifs({'type': 'die', 'payload': d}),
        onEnd=onEnd)
    app.state['jumpGame'].run(threaded=True, untilComplete=True)
    response = {
        'players': app.state['players']
    }
    send_notifs({'type': 'start', 'payload': response})
    return jsonify(response)


def onEnd(d):
    app.state['playing'] = False
    send_notifs({'type': 'end', 'payload': d})


@app.route('/controller', methods=['POST'])
def controller():
    token = request.cookies.get('token')
    gamepad.click(token)
    return 'ok'


if __name__ == '__main__':
    server = gevent.pywsgi.WSGIServer(('0.0.0.0', 8000), app, handler_class=WebSocketHandler)
    server.serve_forever()
