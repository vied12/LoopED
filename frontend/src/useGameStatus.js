import React from 'react'
import { __RouterContext } from 'react-router'
import { getCookie } from './util'

export const useGameConnect = () => {
  const [user, setUser] = React.useState(null)
  const [isFirst, setFirst] = React.useState(false)
  const { history } = React.useContext(__RouterContext)
  console.log('useGameConnect')
  React.useEffect(() => {
    let ws
    // if (!user) {
    fetch('/jump-connect', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })
      .then(d => d.json())
      .then(data => {
        ws = new WebSocket(`ws://localhost:8000/jump`)
        setUser(data)
        // if first player, can decide when to start
        const token = getCookie('token')
        if (data.players.length > 0 && data.players[0].token === token) {
          setFirst(true)
        }
        ws.onmessage = event => {
          const data = JSON.parse(event.data)
          switch (data.type) {
            case 'start': // party started
              history.push('/play')
              break
            case 'join': //someone joined
              setUser({ players: data.payload.players })
              break
            default:
              console.log('dont know', data)
          }
        }
      })
    // }
    return () => {
      if (ws) {
        ws.onmessage = undefined
        ws.close()
      }
    }
  }, [history])

  return {
    ...user,
    isFirst
  }
}

const useGameStatus = ({ gameover }) => {
  const [status, setStatus] = React.useState(null)
  console.log('useGameStatus')
  React.useEffect(() => {
    // if (!status) {
    console.log('useGameStatus GET')
    fetch('/jump-status', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(d => d.json())
      .then(data => {
        setStatus(data)
      })
    // }
  }, [gameover])

  return status
}

export default useGameStatus
