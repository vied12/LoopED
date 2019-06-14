export const useController = () => {
  const controllerSocket = new WebSocket(
    `ws://${process.env.REACT_APP_HOST}/controller`
  )
  return () => {
    controllerSocket.send('jump!')
  }
}
export default useController
