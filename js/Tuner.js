import React from 'react'
import { BackButton } from './BackButton'

export class Tuner extends React.Component {

    componentDidMount() {
        fetch('/tuner', {
            credentials: 'same-origin',
            method: 'POST',
        })
    }

    render() {
        return <BackButton/>
    }
}
