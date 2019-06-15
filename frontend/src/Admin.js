import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    textAlign: 'center'
  },
  body: {}
}))

const Admin = () => {
  const classes = useStyles()

  const restartServer = () => {
    fetch('/restart-server', {
      credentials: 'same-origin',
      method: 'POST'
    })
  }
  return (
    <div className={classes.root}>
      <Typography variant="h1" gutterBottom style={{ marginBottom: 100 }}>
        Admin
      </Typography>

      <div className={classes.body}>
        <Button variant="contained" color="primary" onClick={restartServer}>
          Restart server
        </Button>
      </div>
    </div>
  )
}

export default Admin
