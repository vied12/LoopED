import React from 'react'
import { WaterSurface } from './WaterSurface'
import { isNil } from 'lodash'
import { getCookie, startLEDGame } from './util'

export class JumpGame extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            status: null,
            player: null,
            gameover: false,
        }
    }

    componentWillUnmount() {
        this.ws.close()
    }

    componentWillMount() {
        // start the game
        this.wsEnd = new WebSocket(`ws://${config.HOST}/jump`)
        this.wsEnd.onerror = (event) => {
            console.err('ws err', event)
        }
        this.wsEnd.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log('ws', data)
            const token = getCookie('token')
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate
            const players = data.payload
            if (data.type === 'start') {
                this.setState({
                    status: null,
                    gameover: false,
                })
            } else if (data.type === 'end') {
                const status = players.find((d) => (d.dead && d.token == token)) ? 'loose' : 'win'
                if (status === 'win') {
                    navigator.vibrate([100, 100, 100, 100, 100])
                }
                this.setState({
                    status: status,
                    gameover: true,
                })
            } else if (data.type === 'die') {
                if (players.find((d) => (d.dead && d.token === token))) {
                    navigator.vibrate(1000)
                    this.setState({ status: 'loose' })
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

    restart(e) {
        e.preventDefault()
        e.stopPropagation()
        startLEDGame().then(() => {
            this.setState({
                status: null,
                gameover: false,
            })
        })
    }


    render() {
        const { status, gameover } = this.state
        const { color } = this.props
        const s = {
            ...style,
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        }
        return (
            <div
                style={s}
                onClick={this.handleClick}>
                {!gameover && isNil(status) &&
                    <div>
                    <WaterSurface />
                    <h1 className="pmd-display3" style={styleResult}>JUMP!</h1>
                    </div>
                }
                {status === 'loose' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_dissatisfied</i></div>
                }
                {status === 'win' &&
                    <div style={styleResult}><i className="material-icons pmd-lg">sentiment_very_satisfied</i></div>
                }
                {gameover &&
                    <button
                        onClick={this.restart.bind(this)}
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
JumpGame.propTypes = { color: React.PropTypes.array }