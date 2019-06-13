import React from 'react'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    width: 25,
    height: 25
  }
}))

const ColorBox = ({ color, className }) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(classes.root, className)}
      style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
    />
  )
}

export default ColorBox
