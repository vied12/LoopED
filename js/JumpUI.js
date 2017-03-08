import React from 'react'
import { WaterSurface } from './WaterSurface'
import { getCookie } from './util'

export class JumpUI extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            status: null,
            gameover: false,
        }
    }

    componentDidMount() {
        // start the game
        this.restart()
        const wsEnd = new WebSocket(`ws://${config.HOST}/jump`)
        wsEnd.onmessage = (event) => {
            if (event.data === 'start') {
                // FIXME: DRY
                this.setState({
                    status: null,
                    gameover: false,
                })
            } else {
                const data = JSON.parse(event.data)
                const token = getCookie('token')
                const players = data.payload
                if (data.type === 'end') {
                    const status = players.find((d) => (d.dead && d.token == token)) ? 'loose' : 'win'
                    this.setState({
                        status: status,
                        gameover: true,
                    })
                } else if (data.type === 'die') {
                    if (players.find((d) => (d.dead && d.token == token))) {
                        this.setState({ status: 'loose' })
                    }
                }
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
        this.setState({
            status: null,
            gameover: false,
        }, () => (
            fetch('/jump', {
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
            })
        ))
    }

    render() {
        const { status, gameover } = this.state
        console.log({ status, gameover })
        return (
            <div style={style} onClick={this.handleClick.bind(this)}>
                {!gameover &&
                    <WaterSurface />
                }
                {status === 'loose' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_dissatisfied</i></div>
                }
                {status === 'win' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_very_satisfied</i></div>
                }
                {gameover &&
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
