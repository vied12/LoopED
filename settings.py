import os
PORT = int(os.environ.get('PORT', 8000))
DEBUG = os.environ.get('DEV_MODE', False) == 'true'
STRIP_LENGTH = int(os.environ.get('STRIP_LENGTH', 96))

