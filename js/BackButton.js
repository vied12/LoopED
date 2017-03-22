import React from 'react'
import { Link } from 'react-router'

export function BackButton() {
    return (
        <div style={style.root}>
            <Link to="/">
                <i className="material-icons" style={style.i}>arrow_back</i>
            </Link>
        </div>
    )
}

const style = {
    root: {
        textAlign: 'center',
        paddingTop: 40,
    },
    i: { fontSize: '8em' }
}
