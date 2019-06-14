import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { startLEDGame } from './util'
import { getCookie } from './util'
import find from 'lodash/find'
import ColorBox from './ColorBox'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh'
  },
  body: {
    margin: 60
  },
  displayColor: {
    margin: '20px 0'
  }
}))

const WaitForNextParty = ({ history, initialGameProps, ws }) => {
  const classes = useStyles()
  const [players, setPlayers] = React.useState(initialGameProps.players)
  React.useEffect(() => {
    if (ws) {
      ws.onmessage = event => {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'start': // party started
            history.push('/mor/play')
            break
          case 'join': //someone joined
            setPlayers(data.payload.players)
            break
          default:
            console.log('dont know', data)
        }
      }
    }
    return () => {
      if (ws) {
        ws.onmessage = undefined
      }
    }
  }, [ws, history])
  const token = getCookie('token')
  const me = players && find(players, p => p.token === token)
  return (
    <div className={classes.root}>
      {me && me.color && (
        <div className={classes.displayColor}>
          <Typography>Your color is</Typography>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ColorBox color={me.color} />
          </div>
        </div>
      )}
      <div className={classes.body}>
        {initialGameProps && initialGameProps.isFirst ? (
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
      {players && (
        <Typography variant="body2" color="textSecondary">
          {players.length} player
          {players.length < 2 ? ' is ' : 's are '} in the game
        </Typography>
      )}
    </div>
  )
}

export default WaitForNextParty
