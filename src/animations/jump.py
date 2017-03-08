#!/usr/bin/env python

from bibliopixel import colors

from bibliopixel.util import d
from BiblioPixelAnimations.strip import Rainbows, Wave
from bibliopixel.animation import AnimationQueue
from animations import BaseGameAnim
import sys


class JumpGame(BaseGameAnim):
    def __init__(self, led, gamepad, players, start=0, end=-1):
        super(JumpGame, self).__init__(led, start, end, gamepad)
        self.ball = d(
            position=0,
            direction=1,
            speed=0.1,
        )
        self.action_delay = 15
        self.players = []
        for i, player in enumerate(players):
            self.players.append(d(
                position=(self._led.numLEDs / len(players)) * i
                + (self._led.numLEDs / len(players)) / 2,
                jumping=0,
                blocking=0,
                token=player,
                diying=0,
            ))
            self.addKeyFunc(player, lambda i=i: self.jump(player_idx=i))

    def jump(self, player_idx):
        if self.players[player_idx].jumping:
            self.players[player_idx].blocking = self.action_delay
            self.players[player_idx].jumping = 0
        else:
            self.players[player_idx].jumping = self.action_delay

    def moveBall(self):
        speed = int(round(1/self.ball.speed))
        # do not move depending of speed
        if self._step % speed:
            return
        self.ball.position = (
            self.ball.position +
            (self.ball.direction)) % self._led.numLEDs

    def detectColision(self):
        for p in self.players:
            if p.position == self.ball.position:
                if not p.blocking and not p.jumping:
                    self.kill(p)
                elif p.blocking:
                    self.speedUpBall(.2)
                    self.toggleDirection()

    def kill(self, player):
        player.diying = self.action_delay * 2

    def toggleDirection(self):
        self.ball.direction = 0 - self.ball.direction

    def speedUpBall(self, val=0.1):
        self.ball.speed = min(self.ball.speed + val, 1)

    def step(self, amt=1):
        self._step += amt
        self.moveBall()
        if not self._step % 20:
            self.speedUpBall()
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
                if p.diying == 0:
                    self.animComplete = True
            elif p.jumping:
                p.jumping -= 1
            elif p.blocking:
                self._led.set(p.position, colors.Red)
                p.blocking -= 1
            else:
                self._led.set(p.position, colors.Blue)
        self.handleKeys()
        if self._step == 255:
            self._step = 0


class Jump(AnimationQueue):
    def __init__(self, led, gamepad, players, **kwargs):
        super(Jump, self).__init__(led, **kwargs)
        self.addAnim(Wave.WaveMove(led, colors.White, cycles=5), max_steps=50)
        self.addAnim(JumpGame(
            led, gamepad, players),
            fps=50,
            untilComplete=True)
        self.addAnim(Rainbows.RainbowCycle(led), fps=15)


if __name__ == '__main__':
    from Led import create_led
    from gamepads import TestGamePad
    gamepad = TestGamePad()
    led = create_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
    game = Jump(led, gamepad, players=['1', '2'])
    try:
        game.run(sleep=15, untilComplete=True)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
