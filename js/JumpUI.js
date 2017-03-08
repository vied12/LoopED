import React from 'react'

export const JumpUI = () => {

    fetch('/jump', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
    })

    const handleClick = () => {
        fetch('/controller', {
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ game: 'jump' })
        })
    }
    return (
        <div style={style} onClick={handleClick}>
            Jump !
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
    fontSize: 54,
    paddingTop: 50,
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}
