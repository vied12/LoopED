#!/usr/bin/env python
from flask import Flask, render_template, request, jsonify, abort
import json
import uuid
from looped import Jump, WebGamePad, create_led, Tuner, Intro, Metronome
from flask_sockets import Sockets
import geventwebsocket
import gevent
from bibliopixel import colors
from geventwebsocket.handler import WebSocketHandler

NB_ROUNDS = 10
COLORS = [
    colors.Orange,
    (126, 108, 170),  # colors.Indigo
    colors.Green,
    colors.Violet,
    colors.Olive,
    colors.Blue,
    colors.Yellow,
]


app = Flask(__name__)
app.config.from_envvar('SETTINGS')
led = create_led(dev=app.config['DEBUG'])
gamepad = WebGamePad()
sockets = Sockets(app)

app.state = {
    'current_animation': None,
    'players': [],
    'ws': [],
    'playing': False,
    'all_games_ending': [],
}


@sockets.route('/jump')
def echo_socket(ws):
    token = request.cookies.get('token')
    player = next((_ for _ in app.state['players'] if _['token'] == token))
    app.state['ws'].append(ws)
    player['connected'] = True
    while not ws.closed:
        ws.receive()
    app.state['ws'].remove(ws)
    player['connected'] = False


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
    player['connected'] = True
    data = {
        'players': get_connected_players()
    }
    send_notifs({'type': 'join', 'payload': data})
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    response.set_cookie('token', player['token'])
    return response


def get_connected_players():
    return [_ for _ in app.state['players'] if _.get('connected', True)]


@app.route('/jump-start', methods=['POST'])
def startJump():
    def onEnd(d):
        app.state['playing'] = False
        app.state['all_games_ending'].append(d)
        send_notifs({'type': 'end', 'payload': app.state['all_games_ending']})
        if len(app.state['all_games_ending']) == NB_ROUNDS:
            app.state['all_games_ending'] = []
    if app.state['playing']:
        return abort(400)
    app.state['playing'] = True
    run_animation(Jump(
        led,
        gamepad=gamepad,
        players=get_connected_players(),
        onDie=lambda d: send_notifs({'type': 'die', 'payload': d}),
        onEnd=onEnd
    ), untilComplete=True)
    response = {
        'players': get_connected_players()
    }
    send_notifs({'type': 'start', 'payload': response})
    return jsonify(response)


@app.route('/tuner', methods=['POST'])
def tuner():
    run_animation(Tuner(led))
    return 'ok'


@app.route('/controller', methods=['POST'])
def controller():
    token = request.cookies.get('token')
    key = request.json and request.json.get('key') or None
    gamepad.click(key or token)
    return 'ok'


@app.route('/metronome', methods=['POST'])
def metronome():
    run_animation(Metronome(led, gamepad=gamepad))
    return 'ok'


def run_animation(anim, **kwargs):
    if app.state['current_animation']:
        app.state['current_animation'].stopThread(wait=True)
        app.state['current_animation'] = None
    app.state['current_animation'] = anim
    app.state['current_animation'].run(threaded=True, **kwargs)


if __name__ == '__main__':
    server = gevent.pywsgi.WSGIServer(('0.0.0.0', app.config['PORT']), app, handler_class=WebSocketHandler)
    run_animation(Intro(led), untilComplete=True)
    server.serve_forever()
