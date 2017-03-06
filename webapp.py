#!/usr/bin/env python
from flask import Flask, render_template
import uuid

app = Flask(__name__)


state = {
    'players': []
}


@app.route('/')
def connectJump():
    token = str(uuid.uuid4())
    state['players'].append(token)
    return render_template('index.html', token=token)


@app.route('/jump', methods=['POST'])
def jump():
    return 'ok'


if __name__ == '__main__':
    app.run()
