from bibliopixel.drivers.visualizer import DriverVisualizer
from bibliopixel.drivers.WS2801 import DriverWS2801
from bibliopixel.led import LEDStrip


def create_led(dev=False, length=96):
    if dev:
        driver = DriverVisualizer(length, stayTop=False)
    else:
        driver = DriverWS2801(length, SPISpeed=.2, c_order=[0, 2, 1])
    led = LEDStrip(driver)
    return led
