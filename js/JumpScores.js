import React from 'react'
// import { getCookie } from './util'
import { orderBy } from 'lodash'

function valuesFromLastGames(previousGames) {
    // const token = getCookie('token')
    // var won = 0
    // var lost = 0
    var players = {}
    previousGames.forEach((game) => {
        // if (game.find((d) => (!d.dead && d.token == token))) {
        //     won += 1
        // } else if (game.find((d) => (d.token == token))) {
        //     lost += 1
        // }
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
        // {
        //     name: 'won',
        //     percent: (won / (won + lost)) * 100,
        //     value: won,
        // },
        // {
        //     name: 'lost',
        //     percent: (lost / (won + lost)) * 100,
        //     value: lost,
        // },
        ...orderBy(Object.keys(players).map((pKey) => (
            {
                name: <div className="color" style={{
                    ...styleColor,
                    backgroundColor: `rgb(${players[pKey].color[0]}, ${players[pKey].color[1]}, ${players[pKey].color[2]})`
                }}/>,
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
                        <td className="media-right">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
)

JumpScores.propTypes = { previousGames: React.PropTypes.array }

const style= {
    maxWidth: 400,
    margin: 'auto',
    marginBottom: 40,
    fontFamily: '\'Gloria Hallelujah\', cursive',
}
const styleColor = {
    border: '1px solid black',
    width: 25,
    marginBottom: 5,
    height: 25,
}
