from bibliopixel.animation import AnimationQueue, OffAnim, BaseStripAnim
from BiblioPixelAnimations.strip import ColorPattern
from looped.animations.BaseGameAnim import BaseGameAnim
from bibliopixel import colors
import time
import sys


class Metronome(BaseGameAnim):
    def __init__(self, led, gamepad, start=0, end=-1, bpm=30):
        super(Metronome, self).__init__(led, start, end, gamepad)
        self.last_click = time.time()
        self.bpm = bpm
        self.clickAnim = None
        self.addKeyFunc('1', self.click)
        self.last_click_call = None

    def click(self):
        current_time = time.time()
        if self.last_click_call:
            delta_sec = current_time - self.last_click_call
            self.bpm = 60.0 / delta_sec
        self.last_click_call = current_time
        self.trigger_click(current_time)

    def trigger_click(self, _time=None):
        _time = _time and _time or time.time()
        self.last_click = _time
        self.clickAnim = _time

    def step(self, amt=1):
        self.handleKeys()
        current_time = time.time()
        if not self.clickAnim and current_time - self.last_click >= 60.0 / self.bpm:
            self.trigger_click(current_time)
        if self.clickAnim:
            self._led.fill(colors.White)
            if current_time - self.clickAnim > (60.0 / self.bpm) / 2.0:
                self.clickAnim = None
        else:
            self._led.all_off()


if __name__ == '__main__':
    from looped.Led import create_led
    from looped.gamepads import TestGamePad
    gamepad = TestGamePad()
    led = create_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
    nb = int(len(sys.argv) > 2 and sys.argv[2] or 3)
    anim = Metronome(led, gamepad=gamepad, bpm=nb)
    try:
        anim.run(fps=30, untilComplete=True)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
        import os
        os._exit(0)
