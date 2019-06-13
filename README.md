# Master of the Ring

## Endpoints

+ `POST /jump-connect`

    Get or create the current player. Set him as connected.

    **Returns** connected players.

+ `POST /jump-start`

    Starts a game if no game is currently happening.

    **Returns** connected players.

+ `POST /controller`

    Send a `key` to the controller module.

+ `WS /jump`

    I'm alive

## TODO
- [ ] Admin interface to reset the game
- [ ] progressive score when people start to die
- [ ]