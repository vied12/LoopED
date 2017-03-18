import React from 'react'
import { getCookie, startLEDGame } from './util'

export class WaitingRoom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            players: [],
            loading: true,
            isFirst: true,
        }
    }

    componentDidMount() {
        fetch('/jump-connect', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        })
        .then((d) => d.json())
        .then((newState) => {
            this.setState({
                ...newState,
                // isFirst: newState.players.length === 1,
                loading: false,
            }, () => this.listenForStart())
        })
    }

    componentWillUnmount() {
        this.ws.onmessage = null
    }

    listenForStart() {
        console.log('listenForStart')
        this.ws = new WebSocket(`ws://${config.HOST}/jump`)
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            switch (data.type) {
            case 'start': // party started
                this.join()
                break
            case 'join': //someone joined
                console.log('join', data)
                this.setState({ players: data.payload.players })
                break
            default:
                console.log('dont know', data)
            }
        }
    }

    start() {
        startLEDGame().then(() => {
            this.join()
        })
    }

    join() {
        this.props.onReady({ ...this.state })
    }


    render() {
        const { players, loading, isFirst } = this.state
        const { color } = players.find((d) => d.token === getCookie('token')) || {}
        const s = { ...style }
        if (color) {
            s.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        }
        return (
            <div style={s}>
                <h2>Waiting room</h2>
                {loading &&
                    <p className="lead">Loading...</p>
                }
                {!loading &&
                    <p className="lead">{players.length} players in the room</p>
                }
                {!loading && isFirst &&
                    <button onClick={this.start.bind(this)}
                    className="btn btn-lg pmd-btn-fab pmd-btn-raised pmd-ripple-effect btn-primary" type="button">
                        GO!
                    </button>
                }
            </div>
        )
    }
}
WaitingRoom.propTypes = { onReady: React.PropTypes.func }

const style = {
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
}
