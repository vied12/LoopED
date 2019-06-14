import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import useGameStatus from './useGameStatus'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    marginBottom: theme.spacing(6)
  },
  joinBtn: {
    marginTop: 20,
    marginBottom: 20
  },
  '@keyframes neon4': {
    from: {
      textShadow: `0 0 0px #fff`
    },
    to: {
      textShadow: `0 0 10px #fff, 0 0 20px ${theme.palette.primary.main}`
    }
  },
  rules: {
    textAlign: 'left',
    padding: theme.spacing(3),
    '& ul': {
      listStyleType: 'square'
    }
  },
  hero: {
    color: theme.palette.primary.dark,
    padding: [[theme.spacing(6), theme.spacing(3)]],
    marginBottom: theme.spacing(2),
    '& h1': {
      animation: '$neon4 2s ease-in infinite alternate'
    }
  }
}))

const Intro = () => {
  const classes = useStyles()
  const gameProps = useGameStatus({ gameover: true })
  return (
    <div className={classes.root}>
      <div className={classes.hero}>
        <Typography variant="h1">Master of the Ring</Typography>
      </div>
      <div className={classes.rules}>
        <Typography gutterBottom>
          Hello, <br />
          You are a static pixel on the circle.
        </Typography>
        <Typography>
          You have to avoid the moving pixel and therefore, you have two
          choices:
        </Typography>
        <ul>
          <li>
            <Typography>
              Jump (simple click) and let the crazy pixel to continue its
              journey
            </Typography>
          </li>
          <li>
            <Typography gutterBottom>
              Block it (double click) and make the pixel to change its direction
            </Typography>
          </li>
        </ul>
        <Typography>
          Survive and remain the last alive in order to become the Master of the
          Ring.
        </Typography>
      </div>
      {gameProps && (
        <Typography variant="body2" color="textSecondary">
          {gameProps.players.length} player
          {gameProps.players.length < 2 ? ' is ' : 's are '} playing
        </Typography>
      )}
      <Button
        className={classes.joinBtn}
        size="large"
        variant="contained"
        color="primary"
        disabled={!gameProps}
        component={Link}
        to="/mor/wait"
      >
        Join the party
      </Button>
    </div>
  )
}
export default Intro
