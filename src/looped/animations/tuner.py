from bibliopixel.animation import BaseStripAnim
from bibliopixel import colors
import sys
import pyaudio
import numpy as np
import aubio
import threading

STRINGS = [
    82.4,
    110.0,
    146.79,
    196.0,
    246.88,
    329.6,
]


def record(response):
    # initialise pyaudio
    p = pyaudio.PyAudio()
    # open stream
    buffer_size = 1024
    pyaudio_format = pyaudio.paFloat32
    n_channels = 1
    samplerate = 16000
    stream = p.open(format=pyaudio_format,
                    channels=n_channels,
                    rate=samplerate,
                    input=True,
                    frames_per_buffer=buffer_size)
    # setup pitch
    tolerance = 0.8
    win_s = 4096  # fft size
    hop_s = buffer_size  # hop size
    pitch_o = aubio.pitch('default', win_s, hop_s, samplerate)
    pitch_o.set_tolerance(tolerance)
    while response['continue']:
        audiobuffer = stream.read(buffer_size, exception_on_overflow=False)
        signal = np.fromstring(audiobuffer, dtype=np.float32)
        pitch = pitch_o(signal)[0]
        confidence = pitch_o.get_confidence()
        if confidence > .6:
            response['value'] = pitch
        else:
            response['value'] = None


class Tuner(BaseStripAnim):
    def __init__(self, led, start=0, end=-1):
        super(Tuner, self).__init__(led, start, end)
        self.spacing = (self._led.numLEDs / len(STRINGS))
        self.padding = 6
        self.sensitivity = 4  # Hz

    def preRun(self, **kwrags):
        super(Tuner, self).preRun(**kwrags)
        self.thread_state = {'value': None, 'continue': True}
        self.tuner_thread = threading.Thread(target=record, args=(self.thread_state,))
        self.tuner_thread.setDaemon(True)
        self.tuner_thread.start()

    def _exit(self, *args, **kwrags):
        super(Tuner, self)._exit(*args, **kwrags)
        self.thread_state['continue'] = False
        self.tuner_thread.join()

    def get_closer_note(self, pitch):
        return min(STRINGS, key=lambda x: abs(x - pitch))

    def get_position(self, i):
        return self.spacing * i + self.padding

    def step(self, amt=1):
        for i, string in enumerate(STRINGS):
            pos = self.get_position(i)
            self._led.set(pos, colors.Green)
            for o in range(1, self.padding + 1):
                self._led.set((pos + o) % self._led.numLEDs, colors.White)
                self._led.set((pos - o) % self._led.numLEDs, colors.White)
        pitch = self.thread_state['value']
        if pitch:
            wanted_note = self.get_closer_note(pitch)
            delta = wanted_note - pitch
            if self.sensitivity > abs(delta):
                abs(delta) / self.sensitivity
                offset = int((abs(delta) * self.padding) / self.sensitivity)
                # print(delta, offset)
                pos = self.get_position(STRINGS.index(wanted_note))
                if delta > 0:
                    self._led.set((pos + offset) % self._led.numLEDs, colors.Red)
                else:
                    self._led.set((pos - offset) % self._led.numLEDs, colors.Red)
        self._step += amt
        if self._step > 100:
            self._step = 0


if __name__ == '__main__':
    from looped.Led import create_led
    led = create_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
    nb = int(len(sys.argv) > 2 and sys.argv[2] or 3)
    anim = Tuner(led)
    try:
        anim.run(fps=30, untilComplete=True)
    except KeyboardInterrupt:
        led.all_off()
        led.update()
        import os
        os._exit(0)
