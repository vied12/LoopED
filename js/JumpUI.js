import React from 'react'

export const JumpUI = (props) => {
    const style = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#141313',
    }
    const handleClick = (event) => {
        fetch('/jump', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify({
            // : 'Hubot',
            // login: 'hubot',
            // })
        })
    }
    return (
        <div style={style} onClick={handleClick}>
        </div>
    )
}
