import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useGameConnect } from './useGameStatus'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { startLEDGame } from './util'
import { getCookie } from './util'
import find from 'lodash/find'
import ColorBox from './ColorBox'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    // margin: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh'
  },
  body: {
    margin: 60
  },
  // color: {
  //   width: 25,
  //   height: 25,
  //   margin: '0 auto',
  //   // display: 'inline-block',
  //   // border: '2px solid white',
  // },
  displayColor: {
    margin: '20px 0'
  }
}))

const WaitForNextParty = () => {
  const classes = useStyles()
  const gameProps = useGameConnect()
  const token = getCookie('token')
  const me =
    gameProps.players && find(gameProps.players, p => p.token === token)
  return (
    <div className={classes.root}>
      {me && me.color && (
        <div className={classes.displayColor}>
          <Typography>Your color is</Typography>
          <ColorBox color={me.color} />
        </div>
      )}
      <div className={classes.body}>
        {gameProps && gameProps.isFirst ? (
          <Button variant="contained" color="primary" onClick={startLEDGame}>
            Start
          </Button>
        ) : (
          <div>
            <Typography>Waiting for next match...</Typography>
            <Typography variant="body2">
              Be ready it's starting soon !
            </Typography>
            <CircularProgress size={100} style={{ margin: 40 }} />
          </div>
        )}
      </div>
      {gameProps.players && (
        <Typography variant="body2" color="textSecondary">
          {gameProps.players.length} player
          {gameProps.players.length < 2 ? ' is ' : 's are '} in the game
        </Typography>
      )}
    </div>
  )
}

export default WaitForNextParty
