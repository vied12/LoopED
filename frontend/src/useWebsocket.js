import { useGameConnect } from './useGameStatus'

let ws

export const useWebsocket = () => {
  const gameProps = useGameConnect()
  if (gameProps.ready && !ws) {
    ws = new WebSocket(`ws://localhost:8000/jump`)
    ws.onclose = () => console.log('CLOSE')
    ws.onopen = () => console.log('OPEN')
    ws.onerror = e => console.log('ERROR', e)
  }
  // const [players, setPlayers] = React.useState([])
  // const { history } = React.useContext(__RouterContext)
  // React.useEffect(() => {
  //   ws.onmessage = event => {
  //     const data = JSON.parse(event.data)
  //         switch (data.type) {
  //           case 'start': // party started
  //             history.push('/play')
  //             break
  //           case 'join': //someone joined
  //             setPlayers(data.payload.players)
  //             break
  //           default:
  //             console.log('dont know', data)
  //         }
  //   }
  // })
  return [ws, gameProps]
}
