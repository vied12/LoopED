from bibliopixel.led import LEDStrip
from bibliopixel import colors
from bibliopixel.drivers.WS2801 import DriverWS2801
from bibliopixel.animation import StripChannelTest, BaseStripAnim
from bibliopixel.drivers.visualizer import DriverVisualizer
import time
from bibliopixel.util import d
from bibliopixel.gamepad import BaseGamePad
import sys

LENGTH = 96
NB_PLAYER = 3


class BaseGameAnim(BaseStripAnim):

    def __init__(self, led, start, end, inputDev):
        super(BaseGameAnim, self).__init__(led, start, end)
        self._input_dev = inputDev
        self._keys = None
        self._lastKeys = None
        self._speedStep = 0
        self._speeds = {}
        self._keyfuncs = {}

    def _exit(self, type, value, traceback):
        if hasattr(self._input_dev, 'setLightsOff'):
            self._input_dev.setLightsOff(5)
        self._input_dev.close()

    def setSpeed(self, name, speed):
        self._speeds[name] = speed

    def getSpeed(self, name):
        return self._speeds.get(name)

    def _checkSpeed(self, speed):
        return not (self._speedStep % speed)

    def checkSpeed(self, name):
        return name in self._speeds and self._checkSpeed(self._speeds[name])

    def addKeyFunc(self, key, func, speed=1, hold=True):
        if not isinstance(key, list):
            key = [key]
        for k in key:
            self._keyfuncs[k] = d({
                "func": func,
                "speed": speed,
                "hold": hold,
                "last": False,
                "inter": False
            })

    def handleKeys(self):
        kf = self._keyfuncs
        for key in self._keys:
            val = self._keys[key]
            if key in kf:
                cfg = kf[key]
                speedPass = self._checkSpeed(cfg.speed)

                if cfg.hold:
                    if speedPass:
                        if (val or cfg.inter):
                            cfg.func()
                        else:
                            cfg.inter = cfg.last = val
                elif speedPass:
                    if (val or cfg.inter) and not cfg.last:
                        cfg.func()
                    cfg.inter = cfg.last = val
                else:
                    cfg.inter |= val
        self._lastKeys = self._keys

    def preStep(self, amt):
        pass

    def postStep(self, amt):
        self._speedStep += 1


class TestGamePad(BaseGamePad):
    def __init__(self, **kwargs):
        super(TestGamePad, self).__init__(**kwargs)

    def getKeys(self):
        import sys
        import select

        def heardEnter():
            i, o, e = select.select([sys.stdin], [], [], 0.0001)
            for s in i:
                if s == sys.stdin:
                    sys.stdin.readline()
                    return True
            return False
        return {
            'A': heardEnter(),
        }


class JumpGame(BaseGameAnim):
    def __init__(self, led, start=0, end=-1):
        super(JumpGame, self).__init__(led, start, end, TestGamePad())
        self.addKeyFunc('A', lambda: self.jump(player_idx=0))
        self.ball = d(
            position=0,
            direction=1,
            speed=1,
        )
        # self.position_ball = 0
        # self.direction = 1
        self.players = []
        for i in range(NB_PLAYER):
            p = d(
                position=(LENGTH / NB_PLAYER) * i + (LENGTH / NB_PLAYER) / NB_PLAYER,
                jumping=0,
                blocking=0,
                diying=0,
            )
            self.players.append(p)
        self.action_delay = 15

    def jump(self, player_idx):
        if self.players[player_idx].jumping:
            self.players[player_idx].blocking = self.action_delay
            self.players[player_idx].jumping = 0
        else:
            self.players[player_idx].jumping = self.action_delay

    def moveBall(self):
        self.ball.position = (
            self.ball.position +
            (self.ball.direction * self.ball.speed)) % LENGTH

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
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        driver = DriverVisualizer(LENGTH, stayTop=True)
    else:
        driver = DriverWS2801(LENGTH, SPISpeed=.2, c_order=[0, 2, 1])
    led = LEDStrip(driver)
    anim = JumpGame(led)
    try:
        anim.run(sleep=25)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
