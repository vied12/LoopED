import React from 'react'
import { orderBy } from 'lodash'
import Typography from '@material-ui/core/Typography'
import ColorBox from './ColorBox'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

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
        value: players[pKey].won,
        token: pKey
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
    alignItems: 'center',
    padding: '0px 10px'
  },
  itsme: {
    backgroundColor: 'white',
    color: 'black'
  },
  rank: {
    fontSize: '1.4rem',
    width: 50,
    textAlign: 'left'
  }
}))

export const JumpScores = ({ previousGames, myToken }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant="h6">Scores:</Typography>
      {valuesFromLastGames(previousGames).map(({ color, value, token }, i) => (
        <div
          key={color}
          className={clsx(classes.line, {
            [classes.itsme]: token === myToken
          })}
        >
          <Typography className={classes.rank}>#{i + 1}</Typography>
          <ColorBox color={color} />
          <div style={{ paddingLeft: 20, display: 'flex' }}>
            <Typography>{value}</Typography>
          </div>
        </div>
      ))}
    </div>
  )
}
