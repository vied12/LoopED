import React from 'react'
import Intro from './Intro'
import Mor from './Mor'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import FastClick from 'fastclick'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import primary from '@material-ui/core/colors/yellow'
import 'typeface-bungee-inline'
import 'typeface-vt323'

const theme = createMuiTheme({
  palette: {
    primary: {
      ...primary,
      500: '#e1ff00'
    },
    background: {},
    type: 'dark'
  },
  typography: {
    fontFamily: ['VT323', 'monospace'].join(','),
    h1: {
      fontFamily: 'Bungee Inline, cursive',
      fontSize: '3rem'
    },
    h6: {
      fontFamily: 'Bungee Inline, cursive',
      fontSize: '1.2rem'
    }
  }
})

FastClick.attach(document.body)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route path="/" exact component={Intro}></Route>
        <Route path="/mor" component={Mor}></Route>
      </Router>
    </ThemeProvider>
  )
}

export default App
