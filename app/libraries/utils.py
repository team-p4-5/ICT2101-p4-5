import re
import os
import sys
# import time
import random
# import inspect
import threading
# import socket

"""
TESTING MODE FLAG
"""
# For defining whether product's functionality should be ran in 'testing' mode
TESTING_MODE = True


"""
Database Management
"""
DEFAULT_CHALLENGE_SETTINGS = "3,4,5"
CHALLENGE_SETTINGS_FILE = os.path.join(os.path.dirname(os.path.realpath(__file__)), "settings.txt")
CHALLENGE_RECORDS_FILE = os.path.join(os.path.dirname(os.path.realpath(__file__)), "records.txt")

"""
Administrator
"""
ADMIN_NAME = "admin"
ADMIN_PASS = "admin"


"""
ChallengeSettings
"""
EASY_MODE = "easy"
MEDIUM_MODE = "medium"
HARD_MODE = "hard"
EASY = 0
MEDIUM = 1
HARD = 2

"""
C2 Server Information
"""
C2_PASSPHRASE = str.encode("ICT2101_P4_5_SERVER")
C2_HOSTIP = "0.0.0.0"
C2_PORT = 47656
C2_SOCKET_BUFSIZE = 1024
PING_INTERVAL = 10
NORMAL_RESPONSE = "Z"

"""
Car Commands
"""
MOVE_FORWARD = "moveForward"
MOVE_BACKWARD = "moveBackward"
TURN_LEFT = "turnLeft"
TURN_RIGHT = "turnRight"
NULL_RESPONSE = "0"
