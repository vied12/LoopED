import React from 'react'
import { WaterSurface } from './WaterSurface'

export class JumpUI extends React.Component {

    constructor(props) {
        super(props)
        fetch('/jump', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        })
    }

    handleClick() {
        fetch('/controller', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ game: 'jump' })
        })
    }

    render() {
        return (
            <div style={style} onClick={this.handleClick.bind(this)}>
                <WaterSurface />
            </div>
        )
    }
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
