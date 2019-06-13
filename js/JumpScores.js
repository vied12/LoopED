import React from 'react'
// import { getCookie } from './util'
import { orderBy } from 'lodash'
import Typography from '@material-ui/core/Typography'

function valuesFromLastGames(previousGames) {
    var players = {}
    previousGames.forEach((game) => {
        game.forEach((player) => {
            if (!players[player.token]) {
                players[player.token] = {
                    won: 0,
                    color: player.color1
                }
            }
            if (!player.dead) {
                players[player.token].won += 1
            }
        })
    })

    return [
        ...orderBy(Object.keys(players).map((pKey) => (
            {
                color: players[pKey].color,
                value: players[pKey].won,
            }
        )), ['value'], ['desc'])
    ]

}

export const JumpScores = ({ previousGames }) => (
    (
        <table style={style}>
            <tbody>
                {valuesFromLastGames(previousGames).map(({ name, value, percent }, i) => (
                    <tr key={i}>
                        <td className="media-left">{name}</td>
                        <td className="media-right"><Typography>{value}</Typography></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
)

JumpScores.propTypes = { previousGames: React.PropTypes.array }

const styleColor = {
    border: '1px solid black',
    width: 25,
    marginBottom: 5,
    height: 25,
}
