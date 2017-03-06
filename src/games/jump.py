from bibliopixel import colors
from bibliopixel.util import d
import sys
from BaseGameAnim import BaseGameAnim


class JumpGame(BaseGameAnim):
    def __init__(self, led, gamepad, players, start=0, end=-1):
        super(JumpGame, self).__init__(led, start, end, gamepad)
        self.ball = d(
            position=0,
            direction=1,
            speed=1,
        )
        self.action_delay = 15
        self.players = []
        for i, player in enumerate(players):
            self.players.append(d(
                position=(self._led.numLEDs / len(players)) * i,
                jumping=0,
                blocking=0,
                token=player,
                diying=0,
            ))
            self.addKeyFunc(player, lambda: self.jump(player_idx=i))
        print(self.players)

    def jump(self, player_idx):
        if self.players[player_idx].jumping:
            self.players[player_idx].blocking = self.action_delay
            self.players[player_idx].jumping = 0
        else:
            self.players[player_idx].jumping = self.action_delay

    def moveBall(self):
        self.ball.position = (
            self.ball.position +
            (self.ball.direction)) % self._led.numLEDs
            # (self.ball.direction * self.ball.speed)) % self._led.numLEDs

    def detectColision(self):
        for p in self.players:
            if p.position == self.ball.position:
                if not p.blocking and not p.jumping:
                    self.kill(p)
                elif p.blocking:
                    self.ball.speed += 1
                    self.toggleDirection()

    def kill(self, player):
        player.diying = self.action_delay * 2

    def toggleDirection(self):
        self.ball.direction = 0 - self.ball.direction

    def step(self, amt=1):
        self.moveBall()
        self.detectColision()
        self._led.all_off()
        # ball
        self._led.set(self.ball.position, colors.White)
        # players
        for p in self.players:
            if p.diying:
                if not p.diying % 3:
                    self._led.set(p.position, colors.Orange)
                else:
                    self._led.set(p.position, colors.Green)
                p.diying -= 1
            elif p.jumping:
                p.jumping -= 1
            elif p.blocking:
                self._led.set(p.position, colors.Red)
                p.blocking -= 1
            else:
                self._led.set(p.position, colors.Blue)
        self._step += amt
        self.handleKeys()


if __name__ == '__main__':
    from Led import get_led
    led = get_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
    anim = JumpGame(led, 3)
    try:
        anim.run(sleep=25)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
