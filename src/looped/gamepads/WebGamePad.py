from bibliopixel.gamepad import BaseGamePad
import logging
from ..throttle import throttle

logger = logging.Logger(__name__)


class WebGamePad(BaseGamePad):
    def __init__(self, **kwargs):
        super(WebGamePad, self).__init__(**kwargs)
        self.keys = {}

    def getKeys(self):
        keys = self.keys.copy()
        for token in self.keys.keys():
            self.keys[token] = False
        return keys

    @throttle(seconds=1)
    def click(self, token):
        self.keys[token] = True
