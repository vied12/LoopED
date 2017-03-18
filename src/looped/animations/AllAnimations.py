#!/usr/bin/env python

from looped import create_led
from BiblioPixelAnimations.strip import Rainbows, LarsonScanners, Wave, \
    PixelPingPong, Alternates, ColorChase, ColorPattern, ColorWipe, \
    FireFlies, HalvesRainbow, PartyMode, Searchlights, WhiteTwinkle
from bibliopixel.animation import AnimationQueue
from bibliopixel import colors
import sys

led = create_led(dev=len(sys.argv) > 1 and sys.argv[1] == 'test')
queue = AnimationQueue(led)
queue.addAnim(WhiteTwinkle.WhiteTwinkle(led), fps=20, max_steps=200)
queue.addAnim(Searchlights.Searchlights(led), fps=50, max_steps=550)
queue.addAnim(PartyMode.PartyMode(led, PartyMode.rainbow), fps=15, max_steps=50)
queue.addAnim(HalvesRainbow.HalvesRainbow(led), fps=50, max_steps=150)
queue.addAnim(FireFlies.FireFlies(led, FireFlies.rainbow), fps=20, max_steps=100)
queue.addAnim(ColorWipe.ColorWipe(led, colors.Red), fps=40, max_steps=150)
queue.addAnim(ColorPattern.ColorPattern(led, ColorPattern.rainbow, 3), fps=40, max_steps=150)
queue.addAnim(ColorChase.ColorChase(led, colors.Blue), fps=40, max_steps=150)
queue.addAnim(Alternates.Alternates(led), fps=5, max_steps=20)
queue.addAnim(PixelPingPong.PixelPingPong(led, color=colors.White, max_led=led.numLEDs, total_pixels=2, fade_delay=4), fps=40, max_steps=150)
queue.addAnim(Wave.WaveMove(led, colors.White, cycles=10), fps=40, max_steps=150)
queue.addAnim(Wave.Wave(led, colors.White, cycles=10), fps=40, max_steps=150)
queue.addAnim(LarsonScanners.LarsonRainbow(led), fps=40, max_steps=150)
queue.addAnim(LarsonScanners.LarsonScanner(led, colors.White), fps=40, max_steps=150)
queue.addAnim(Rainbows.RainbowCycle(led), fps=40, max_steps=150)
# queue.addAnim(JumpIntro(led), untilComplete=True, max_steps=150)
# queue.addAnim(JumpGame(led, gamepad, ['1', '2']), fps=40)
queue.run()
