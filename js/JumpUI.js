import React from 'react'
import { getCookie } from './util'

export const JumpUI = (props) => {

    const handleClick = (event) => {
        fetch('/jump', {
            credentials: 'same-origin',
            method: 'POST',
        })
    }
    return (
        <div style={style} onClick={handleClick}>
            {getCookie('token')}
        </div>
    )
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
    paddingTop: 50,
}
