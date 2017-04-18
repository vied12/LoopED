import React from 'react'

export default class SetTempo extends React.Component {
    constructor(props) {
        super(props)
        this.previousClick = null
    }
    onClick() {
        if (this.previousClick) {
            const now = new Date().getTime()
            const deltaSeconds = (now - this.previousClick) / 1000
            this.props.onChange(Math.round(60 / (deltaSeconds)))
            this.previousClick = now
        } else {
            this.previousClick = new Date().getTime()
        }
    }

    render() {
        return <div style={setTempoStyle} onClick={this.onClick.bind(this)}/>
    }
}
SetTempo.propTypes = { onChange: React.PropTypes.func }
const setTempoStyle = {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    margin: '40px auto',
}
