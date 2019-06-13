import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: 25,
    height: 25,
    margin: '0 auto'
  }
}))

const ColorBox = ({ color }) => {
  const classes = useStyles()
  return (
    <div
      className={classes.root}
      style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
    />
  )
}

export default ColorBox
