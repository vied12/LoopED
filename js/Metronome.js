import React from 'react'
import { BackButton } from './BackButton'
class SetTempo extends React.Component {
    constructor(props) {
        super(props)
        this.previousClick = null
        // this.state = { bpm: null }
    }
    onClick() {
        if (this.previousClick) {
            const now = new Date().getTime()
            const deltaSeconds = (now - this.previousClick) / 1000
            this.props.onBpm(60 / (deltaSeconds))
            // this.setState({ bpm: 60 / (deltaSeconds) })
            this.previousClick = now
        } else {
            this.previousClick = new Date().getTime()
        }
    }

    render() {
        return <div style={setTempoStyle} onClick={this.onClick.bind(this)}/>
    }
}
SetTempo.propTypes = { onBpm: React.PropTypes.func }
const setTempoStyle = {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    margin: 'auto',
    marginTop: 40,
}
export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = { bpm: null }
    }

    componentDidMount() {
        fetch('/metronome', {
            credentials: 'same-origin',
            method: 'POST',
        })
    }

    onBpm(bpm) {
        fetch('/controller', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ key: '1' })
        })
        this.setState({ bpm: bpm })
    }

    render() {
        const { bpm } = this.state
        return (
            <div>
                <SetTempo onBpm={this.onBpm.bind(this)}/>
                <div style={metroStyle}>
                    {bpm &&
                        <span>{Math.round(bpm)} bpm</span>
                    }
                </div>
                <BackButton/>
            </div>
        )
    }
}
const metroStyle = {
    textAlign: 'center',
    fontSize: '2em',
}
