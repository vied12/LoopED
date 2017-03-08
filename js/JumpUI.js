import React from 'react'
import { WaterSurface } from './WaterSurface'
import { getCookie } from './util'

export class JumpUI extends React.Component {

    constructor(props) {
        super(props)
        this.state = { status: 'waiting' }
    }

    componentDidMount() {
        // start the game
        this.restart()
        this.wsEnd = new WebSocket(`ws://${config.HOST}/jump`)
        this.wsEnd.onmessage = (event) => {
            if (event.data === 'start') {
                this.setState({ status: 'playing' })
            } else {
                const token = getCookie('token')
                const players = JSON.parse(event.data)
                const looser = players.find((p) => p.dead)
                const isItMe = looser.token === token
                const status = isItMe ? 'loose' : 'win'
                this.setState({ status: status })
            }
        }
    }

    handleClick() {
        fetch('/controller', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ game: 'jump' })
        })
    }

    restart() {
        this.setState({ status: 'playing' }, () => (
            fetch('/jump', {
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            })
        ))
    }

    render() {
        const { status } = this.state
        return (
            <div style={style} onClick={this.handleClick.bind(this)}>
                {status === 'playing' &&
                    <WaterSurface />
                }
                {status === 'loose' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_dissatisfied</i></div>
                }
                {status === 'win' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_very_satisfied</i></div>
                }
                {['win', 'loose'].indexOf(status) > -1 &&
                    <button onClick={this.restart.bind(this)}
                    className="btn btn-lg pmd-btn-fab pmd-btn-raised pmd-ripple-effect btn-primary" type="button">
                        <i className="material-icons pmd-sm">replay</i>
                    </button>
                }
            </div>
        )
    }
}
const styleResult = {
    marginTop: 140,
    marginBottom: 80,
}
const style = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#141313',
    color: 'white',
    textAlign: 'center',
    fontSize: 54,
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}
