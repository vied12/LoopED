from bibliopixel.animation import AnimationQueue, OffAnim
from BiblioPixelAnimations.strip import ColorPattern


class Intro(AnimationQueue):
    def __init__(self, led):
        super(Intro, self).__init__(led)
        self.addAnim(ColorPattern.ColorPattern(led, ColorPattern.rainbow, 3), fps=40, max_steps=150)
        self.addAnim(OffAnim(led), fps=40, max_steps=1)
