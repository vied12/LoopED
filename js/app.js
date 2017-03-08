import React from 'react'
import ReactDOM from 'react-dom'
import { GameList } from './GameList'
import { JumpUI } from './JumpUI'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

function App({ children }) {
    return (children)
}

function Game(Children) {
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
                <li className="active">Jump</li>
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
            <Route path="jump" component={Game.bind(null, JumpUI)} />
        </Route>
    </Router>
), document.getElementById('reactEntry'))
