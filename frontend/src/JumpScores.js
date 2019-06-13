import React from 'react'
import { orderBy } from 'lodash'
import Typography from '@material-ui/core/Typography'
import ColorBox from './ColorBox'
import { makeStyles } from '@material-ui/core'

function valuesFromLastGames(previousGames) {
  var players = {}
  previousGames.forEach(game => {
    game.forEach(player => {
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
    ...orderBy(
      Object.keys(players).map(pKey => ({
        color: players[pKey].color,
        value: players[pKey].won
      })),
      ['value'],
      ['desc']
    )
  ]
}

const useStyles = makeStyles(theme => ({
  root: { margin: '40px 0' },
  line: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export const JumpScores = ({ previousGames }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant="h6">Scores:</Typography>
      {valuesFromLastGames(previousGames).map(({ color, value }, i) => (
        <div key={color} className={classes.line}>
          <ColorBox color={color} />
          <div style={{ paddingLeft: 20 }}>
            <Typography>{value}</Typography>
          </div>
        </div>
      ))}
    </div>
  )
}
