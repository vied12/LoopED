import React from 'react'
import { Route } from 'react-router-dom'
import { Switch } from 'react-router'
import PlayGame from './PlayGame'
import WaitForNextParty from './WaitForNextParty'
import { useWebsocket } from './useWebsocket'

const Mor = ({ match }) => {
  const [ws, gameProps] = useWebsocket()
  return (
    <Switch>
      <Route
        path={`${match.path}/wait`}
        exact
        component={props => (
          <WaitForNextParty {...props} ws={ws} initialGameProps={gameProps} />
        )}
      ></Route>
      <Route
        path={`${match.path}/play`}
        exact
        component={props => <PlayGame {...props} ws={ws} />}
      ></Route>
    </Switch>
  )
}

export default Mor
