from bibliopixel.drivers.visualizer import DriverVisualizer
from bibliopixel.drivers.WS2801 import DriverWS2801
from bibliopixel.led import LEDStrip


def get_led(dev=False, length=96):
    if dev:
        driver = DriverVisualizer(length, stayTop=True)
    else:
        driver = DriverWS2801(length, SPISpeed=.2, c_order=[0, 2, 1])
    led = LEDStrip(driver)
    return led
