import React from 'react'
import { default as SetTempoPad } from './SetTempoPad'
import { BackButton } from './BackButton'

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = { bpm: 60 }
    }

    componentDidMount() {
        fetch('/metronome', {
            credentials: 'same-origin',
            method: 'POST',
        })
    }

    onBpm(bpm) {
        fetch('/metronome', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ bpm }),
        })
        this.setState({ bpm: bpm })
    }

    render() {
        const { bpm } = this.state
        return (
            <div style={style}>
                <SetTempoPad onChange={this.onBpm.bind(this)}/>
                <span style={inputStyle}>
                    <input type="number" value={bpm} onChange={(e) => this.onBpm(e.target.value)}/> bpm
                </span>
                <BackButton/>
            </div>
        )
    }
}
const inputStyle = {
    textAlign: 'center',
    marginTop: 20,
}
const style = {
    textAlign: 'center',
    fontSize: '2em',
}
