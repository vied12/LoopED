import React from 'react'
import Intro from './Intro'
import Mor from './Mor'
import Admin from './Admin'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import FastClick from 'fastclick'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import primaryColor from '@material-ui/core/colors/yellow'
import 'typeface-bungee-inline'
import 'typeface-vt323'

const primary = {
  ...primaryColor,
  500: '#f7ff00'
}

const theme = createMuiTheme({
  palette: {
    primary,
    background: {},
    type: 'dark'
  },
  typography: {
    fontFamily: ['VT323', 'monospace'].join(','),
    h1: {
      fontFamily: 'Bungee Inline, cursive',
      fontSize: '3rem',
      color: primary[500]
    },
    h6: {
      fontFamily: 'Bungee Inline, cursive',
      fontSize: '1.2rem',
      color: primary[500]
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
        <Route path="/aaa" component={Admin}></Route>
      </Router>
    </ThemeProvider>
  )
}

export default App
