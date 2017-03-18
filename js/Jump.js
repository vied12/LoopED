import React from 'react'
import { WaitingRoom } from './WaitingRoom'
import { JumpGame } from './JumpGame'
import { getCookie } from './util'

export class Jump extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            waiting: true,
            player: null,
        }
    }

    handleOnReady(params) {
        this.setState({
            waiting: false,
            player: params.players.find((d) => d.token === getCookie('token')),
        })
    }

    render() {
        const { waiting, player } = this.state
        if (waiting) {
            return <WaitingRoom onReady={this.handleOnReady.bind(this)}/>
        }
        return <JumpGame player={player}/>
    }
}
