#!/usr/bin/env python

from bibliopixel import colors
from bibliopixel.util import d
from BiblioPixelAnimations.strip import Rainbows, Wave
from bibliopixel.animation import AnimationQueue
from looped.animations.BaseGameAnim import BaseGameAnim
import sys
import random
import time

SPEED_ANIMATION = 500
TIME_TO_SLEEP_BEFORE_START = 2  # seconds


def complement(r, g, b):
    def hilo(a, b, c):
        if c < b:
            b, c = c, b
        if b < a:
            a, b = b, a
        if c < b:
            b, c = c, b
        return a + c
    k = hilo(r, g, b)
    return tuple(k - u for u in (r, g, b))


def easeInQuad(n):
    """A quadratic tween function that begins slow and then accelerates.
    Args:
      n (float): The time progress, starting at 0.0 and ending at 1.0.
    Returns:
      (float) The line progress, starting at 0.0 and ending at 1.0. Suitable for passing to getPointOnLine().
    """
    if not 0.0 <= n <= 1.0:
        raise ValueError('Argument must be between 0.0 and 1.0.')
    return n**2


class JumpGame(BaseGameAnim):
    def __init__(self, led, gamepad, players, onDie=None, onEnd=None, start=0, end=-1):
        super(JumpGame, self).__init__(led, start, end, gamepad)
        self.onDie = onDie
        self.onEnd = onEnd
        self.ball = dict(
            position=0,
            direction=random.choice([1, -1]),
            speed=0,
            speed_to_reach=0,
            speed_animation=None,
        )
        self.action_delay = 20
        self.players = []
        random.shuffle(players)
        for i, player in enumerate(players):
            self.players.append(d(
                position=(self._led.numLEDs / len(players)) * i
                + (self._led.numLEDs / len(players)) / 2,
                jumping=0,
                color1=player.get('color', (255, 0, 0)),
                color2=complement(*player.get('color', (255, 0, 0))),
                blocking=0,
                token=player['token'],
                diying=0,
                dead=False,
            ))
            self.addKeyFunc(
                player['token'],
                lambda i=i: self.jump(player_idx=i)
            )

    def preRun(self, **kwrags):
        super(JumpGame, self).preRun(**kwrags)
        self.start_time = time.time()

    def jump(self, player_idx):
        if self.players[player_idx].jumping:
            self.players[player_idx].blocking = self.action_delay
            self.players[player_idx].jumping = 0
        else:
            self.players[player_idx].jumping = self.action_delay

    def get_time(self):
        return time.time() - self.start_time

    def moveBall(self):
        if self.ball['speed_to_reach'] <= 0 and self.get_time() > TIME_TO_SLEEP_BEFORE_START:
            self.speedUpBall(1)
        if self.ball['speed_animation']:
            progress = 1 - (float(self.ball['speed_animation']) / SPEED_ANIMATION)
            # progress = easeInQuad(progress)
            delta = self.ball['speed_to_reach'] - self.ball['previous_speed']
            self.ball['speed'] = self.ball['previous_speed'] + (delta * progress)
            self.ball['speed_animation'] -= 1
        if self.ball['speed'] > 0:
            speed = int(round(1/self.ball['speed']))
            # do not move depending of speed
            if self._step % speed:
                return
            self.ball['position'] = (
                self.ball['position'] +
                (self.ball['direction'])) % self._led.numLEDs

    def detectColision(self):
        for p in self.players:
            if not p['dead'] and p.position == self.ball['position']:
                if not p.blocking and not p.jumping:
                    self.kill(p)
                    if random.randint(0, 3) == 0:
                        self.toggleDirection()
                elif p.blocking:
                    self.toggleDirection()

    def kill(self, player):
        player['dead'] = True
        player['diying'] = self.action_delay * 2
        self.speedUpBall(-.4)
        if self.onDie:
            self.onDie(self.players)

    def toggleDirection(self):
        self.ball['direction'] = 0 - self.ball['direction']

    def speedUpBall(self, val=0.1):
        if val > 0:
            self.ball['speed_to_reach'] = min(max(self.ball['speed_to_reach'] + val, 0.1), 1)
            self.ball['speed_animation'] = SPEED_ANIMATION
            self.ball['previous_speed'] = self.ball['speed']
        else:
            self.ball['speed_animation'] = SPEED_ANIMATION
            self.ball['speed'] = min(max(self.ball['speed'] + val, 0.1), 1)

    def end(self):
        if self.onEnd:
            self.onEnd(self.players)
        self.animComplete = True

    def is_time_to_end(self):
        min_player_alive = min(len(self.players), 2)
        return len([
            _ for _ in self.players if _['diying'] > 0 or not _['dead']
        ]) < min_player_alive

    def step(self, amt=1):
        self._step += amt
        if self.is_time_to_end():
            return self.end()
        self.moveBall()
        self.detectColision()
        self._led.all_off()
        # ball
        self._led.set(self.ball['position'], colors.White)
        # players
        for p in self.players:
            if p.diying:
                if not p.diying % 3:
                    self._led.set(p.position, colors.White)
                else:
                    self._led.set(p.position, p.color2)
                p['diying'] -= 1
            elif p.jumping:
                p.jumping -= 1
            elif p.blocking:
                self._led.set(p.position, colors.Red)
                p.blocking -= 1
            elif not p['dead']:
                self._led.set(p.position, p.color1)
        self.handleKeys()
        if self._step == 2000:
            self._step = 0


class Jump(AnimationQueue):
    def __init__(self, led, gamepad, players, onDie=None, onEnd=None):
        super(Jump, self).__init__(led)
        # intro
        self.addAnim(Wave.WaveMove(led, colors.White, cycles=5), max_steps=50)
        # game
        self.addAnim(JumpGame(
            led, gamepad, players, onDie=onDie, onEnd=onEnd),
            fps=55,
            untilComplete=True)
        # outro
        self.addAnim(Rainbows.RainbowCycle(led), fps=15)


if __name__ == '__main__':
    from looped.Led import create_led
    from looped.gamepads import TestGamePad
    gamepad = TestGamePad()
    led = create_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
    nb = int(len(sys.argv) > 2 and sys.argv[2] or 3)
    game = Jump(led, gamepad, players=[{'token': _} for _ in range(nb)])
    try:
        game.run(sleep=15, untilComplete=True)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
