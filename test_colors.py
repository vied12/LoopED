from bibliopixel.led import LEDStrip
from bibliopixel.animation import StripChannelTest
from bibliopixel.drivers.LPD8806 import DriverLPD8806

driver = DriverLPD8806(12)
led = LEDStrip(driver)

anim = StripChannelTest(led)
anim.run()
