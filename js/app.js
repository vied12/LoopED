import React from 'react'
import ReactDOM from 'react-dom'
import { GameList } from './GameList'
import { Jump } from './Jump'
import { Tuner } from './Tuner'
import Metronome from './Metronome'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import FastClick from 'fastclick'

FastClick.attach(document.body)

function App({ children }) {
    return (children)
}

function Game(Children, title) {
    const style = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 40,
        bottom: 0,
    }
    return (
        <div>
            <ol className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li className="active">{title}</li>
            </ol>
            <div style={style}>
                <Children />
            </div>
        </div>
    )
}
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={GameList} />
            <Route path="jump" component={Game.bind(null, Jump, 'Jump')} />
            <Route path="tuner" component={Game.bind(null, Tuner, 'Tuner')} />
            <Route path="metronome" component={Game.bind(null, Metronome, 'Metronome')} />
        </Route>
    </Router>
), document.getElementById('reactEntry'))
