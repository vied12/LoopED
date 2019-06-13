import React from 'react'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import { getCookie, startLEDGame } from './util'
import isNil from 'lodash/isNil'
import find from 'lodash/find'
import { JumpScores } from './JumpScores'
import Replay from '@material-ui/icons/Replay'
import ButtonBase from '@material-ui/core/ButtonBase'
import useController from './useController'
import useGameStatus from './useGameStatus'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import deadImg from './dead.png'
import Slide from '@material-ui/core/Slide'
import Grow from '@material-ui/core/Grow'

const useCenterStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '100vh',
    height: '100vh'
  }
}))

const Center = props => {
  const classes = useCenterStyles()
  return <div className={classes.root} {...props} />
}

const PlayGame = () => {
  const [state, setState] = React.useState({})
  const handleJump = useController()

  const restart = e => {
    e.preventDefault()
    e.stopPropagation()
    startLEDGame().then(() => {
      setState({
        status: null,
        gameover: false
      })
    })
  }

  React.useEffect(() => {
    console.log('play -> connect to ws')
    const ws = new WebSocket(`ws://localhost:8000/jump`)
    ws.onerror = event => {
      console.error('ws err', event)
    }
    ws.onmessage = event => {
      const data = JSON.parse(event.data)
      const token = getCookie('token')
      const action = [
        {
          type: 'start',
          do: () => {
            navigator.vibrate([100, 100, 100])
            setState({
              status: null,
              gameover: false
            })
          }
        },
        {
          type: 'end',
          do: () => {
            const lastGamePlayers = data.payload[data.payload.length - 1]
            const status = lastGamePlayers.find(
              d => d.dead && d.token === token
            )
              ? 'loose'
              : 'win'
            if (status === 'win') {
              navigator.vibrate([100, 100, 100, 100, 100])
            }
            setState({
              status: status,
              gameover: true,
              lastGames: data.payload
            })
          }
        },
        {
          type: 'die',
          do: () => {
            const players = data.payload
            if (players.find(d => d.dead && d.token === token)) {
              navigator.vibrate(1000)
              setState({ status: 'loose' })
            }
          }
        }
      ].find(d => d.type === data.type)
      if (action) {
        action.do()
      }
    }
    // clean up
    return () => {
      ws.close()
    }
  }, [])
  const gameStatus = useGameStatus({ gameover: state.gameover })

  if (gameStatus && !gameStatus.playing) {
    return <Redirect to="/wait" />
  }
  const token = getCookie('token')
  const me =
    gameStatus &&
    gameStatus.players &&
    find(gameStatus.players, p => p.token === token)
  console.log({ me, token, gameStatus })
  const { status, gameover, lastGames } = state
  return (
    <Center>
      <Grow in={!gameover && isNil(status)} unmountOnExit mountOnEnter>
        <div style={{ position: 'absolute', width: '100%' }}>
          <ButtonBase
            style={{ height: '100vh', width: '100%', flexDirection: 'column' }}
            onClick={handleJump}
          >
            <Typography variant="h6" gutterBottom>
              Fight !
            </Typography>
            <Typography>Avoid: simple click</Typography>
            <Typography>Block: double click</Typography>
          </ButtonBase>
        </div>
      </Grow>
      <Slide direction="up" in={status === 'loose'} unmountOnExit mountOnEnter>
        <div style={{ textAlign: 'center' }}>
          <Typography>You're dead</Typography>
          <img
            src={deadImg}
            alt="You're dead"
            style={{ width: 120, filter: 'invert(.6)' }}
          />
        </div>
      </Slide>
      <Slide direction="up" in={status === 'win'} unmountOnExit mountOnEnter>
        <div style={{ textAlign: 'center' }}>
          <Typography>You are the</Typography>
          <Typography variant="h6" color="primary">
            Master of the Ring
          </Typography>
        </div>
      </Slide>
      <Slide direction="up" in={gameover} unmountOnExit mountOnEnter>
        <div>
          {lastGames && <JumpScores previousGames={lastGames} />}
          <Fab color="primary" onClick={restart}>
            <Replay />
          </Fab>
        </div>
      </Slide>
    </Center>
  )
}

export default PlayGame
