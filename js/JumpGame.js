import React from 'react'
import { WaterSurface } from './WaterSurface'
import { JumpScores } from './JumpScores'
import { isNil } from 'lodash'
import { getCookie, startLEDGame } from './util'

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate

export class JumpGame extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            status: null,
            player: null,
            gameover: false,
            lastGames: null,
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
            const token = getCookie('token')
            const action = [
                {
                    type: 'start',
                    do: () => {
                        navigator.vibrate([100, 100, 100])
                        this.setState({
                            status: null,
                            gameover: false,
                        })
                    }
                },
                {
                    type: 'end',
                    do: () => {
                        const lastGamePlayers = data.payload[data.payload.length - 1]
                        const status = lastGamePlayers.find((d) => (d.dead && d.token == token)) ? 'loose' : 'win'
                        if (status === 'win') {
                            navigator.vibrate([100, 100, 100, 100, 100])
                        }
                        this.setState({
                            status: status,
                            gameover: true,
                            lastGames: data.payload,
                        })
                    }
                },
                {
                    type: 'die',
                    do: () => {
                        const players = data.payload
                        if (players.find((d) => (d.dead && d.token === token))) {
                            navigator.vibrate(1000)
                            this.setState({ status: 'loose' })
                        }
                    }
                }
            ].find((d) => (d.type === data.type))
            if (action) {
                action.do()
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
        const { status, gameover, lastGames } = this.state
        const { player: { color } } = this.props
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
                    <div>
                        {lastGames && <JumpScores previousGames={lastGames}/>}
                        <button
                            onClick={this.restart.bind(this)}
                            className="btn btn-lg pmd-btn-fab pmd-btn-raised pmd-ripple-effect btn-primary" type="button">
                            <i className="material-icons pmd-sm">replay</i>
                        </button>
                    </div>
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
JumpGame.propTypes = { player: React.PropTypes.object }
