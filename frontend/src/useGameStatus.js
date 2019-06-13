import React from 'react'
import { __RouterContext } from 'react-router'
import { getCookie } from './util'
// import { useWebsocket } from './useWebsocket'

export const useGameConnect = () => {
  const [user, setUser] = React.useState(null)
  const [isFirst, setFirst] = React.useState(false)
  const { history } = React.useContext(__RouterContext)
  // const ws = useWebsocket()
  console.log('useGameConnect')
  React.useEffect(() => {
    console.log('useGameConnect POST')
    // let ws
    // if (!user) {
    fetch('/jump-connect', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    })
      .then(d => d.json())
      .then(data => {
        // ws = new WebSocket(`ws://localhost:8000/jump`)
        setUser({
          ...data,
          ready: true
        })
        // if first player, can decide when to start
        const token = getCookie('token')
        if (data.players.length > 0 && data.players[0].token === token) {
          setFirst(true)
        }
      })
    // }
    // return () => {
    //   if (ws) {
    //     ws.onmessage = undefined
    //     // ws.close()
    //   }
    // }
  }, [history])

  return {
    ...user,
    isFirst
  }
}

const useGameStatus = () => {
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
  }, [])

  return status
}

export default useGameStatus
