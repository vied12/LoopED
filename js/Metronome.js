import React from 'react'
import { default as SetTempoPad } from './SetTempoPad'
import { CirclePicker } from 'react-color'
import { BackButton } from './BackButton'

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            bpm: 60,
            color: {
                a: 1,
                r: 255,
                g: 255,
                b: 255,
            }
        }
    }

    componentDidMount() {
        this.configStrip()
    }

    configStrip() {
        const { bpm, color } = this.state
        fetch('/metronome', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                bpm,
                color: [color.r, color.g, color.b],
            }),
        })
    }

    onBpmChange(bpm) {
        this.setState({ bpm: bpm }, this.configStrip)
    }

    onColorChange(color) {
        this.setState({ color: color.rgb }, this.configStrip)
    }

    render() {
        const { bpm, color } = this.state
        const colors = [
            '#f44336',
            '#e91e63',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#2196f3',
            '#03a9f4',
            '#00bcd4',
            '#009688',
            '#4caf50',
            '#8bc34a',
            '#cddc39',
            '#ffeb3b',
            '#ffc107',
            '#ff9800',
            '#ff5722',
            '#607d8b',
            'white',
        ]
        return (
            <div style={style}>
                <SetTempoPad onChange={this.onBpmChange.bind(this)}/>
                <div style={inputStyle}>
                    <input type="number" value={bpm} onChange={(e) => this.onBpmChange(e.target.value)}/> bpm
                </div>
                <div style={colorsStyle}>
                    <CirclePicker colors={colors} color={color} onChangeComplete={this.onColorChange.bind(this)} />
                </div>
                <BackButton/>
            </div>
        )
    }
}
const colorsStyle = { paddingTop: 40 }
const inputStyle = {
    textAlign: 'center',
    marginTop: 20,
    margin: 'auto',
    fontSize: '2em',
}
const style = {
    textAlign: 'center',
}
