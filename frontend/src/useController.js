export const useController = () => {
  const controllerSocket = new WebSocket(`ws://localhost:8000/controller`)
  return () => {
    controllerSocket.send('jump!')
  }
}
export default useController
