from bibliopixel.gamepad import BaseGamePad
import sys
import select


def heardEnter():
    i, o, e = select.select([sys.stdin], [], [], 0.0001)
    for s in i:
        if s == sys.stdin:
            sys.stdin.readline()
            return True
            return False


class TestGamePad(BaseGamePad):
    def __init__(self, **kwargs):
        super(TestGamePad, self).__init__(**kwargs)

    def getKeys(self):
        return {
            'A': heardEnter(),
        }
