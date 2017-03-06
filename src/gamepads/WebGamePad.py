from bibliopixel.gamepad import BaseGamePad
import logging

logger = logging.Logger(__name__)

class WebGamePad(BaseGamePad):
    def __init__(self, **kwargs):
        super(WebGamePad, self).__init__(**kwargs)
        self.keys = {}

    def getKeys(self):
        keys = self.keys.copy()
        for token in self.keys.keys():
            self.keys[token] = False
        logger.debug(self.keys)
        return keys

    def click(self, token):
        self.keys[token] = True
