import React from 'react'
import { getCookie } from './util'

function valuesFromLastGames(previousGames) {
    const token = getCookie('token')
    var won = 0
    var lost = 0
    previousGames.forEach((game) => {
        if (game.find((d) => (!d.dead && d.token == token))) {
            won += 1
        } else if (game.find((d) => (d.token == token))) {
            lost += 1
        }
    })

    return [
        {
            name: 'won',
            percent: (won / (won + lost)) * 100,
            value: won,
        },
        {
            name: 'lost',
            percent: (lost / (won + lost)) * 100,
            value: lost,
        },
    ]

}

export const JumpScores = ({ previousGames }) => (
    (
        <table style={style}>
            <tbody>
                {valuesFromLastGames(previousGames).map(({ name, value, percent }) => (
                    <tr key={name}>
                        <td className="media-left">{name}</td>
                        <td className="media-body">
                            <div className="progress cash-progressbar">
                            <div className="progress-bar" style={{ width: `${percent}%` }} />
                            </div>
                        </td>
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
}
