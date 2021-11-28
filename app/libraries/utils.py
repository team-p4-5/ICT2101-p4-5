import re
import os
import sys
import time
import random
import base64
import hashlib
import inspect
import threading
import socket
from rich import pretty
from rich.prompt import Prompt
from rich.console import Console

"""
Initialises Console and Prompt objects from rich library.
Used for printing and formatting
"""
pretty.install()
console = Console()
prompt = Prompt()

"""
Database Management
"""
DEFAULT_CHALLENGE_SETTINGS = "3,4,5"
CHALLENGE_SETTINGS_FILE = os.path.join(os.path.dirname(os.path.realpath(__file__)), "settings.txt")
CHALLENGE_RECORDS_FILE = os.path.join(os.path.dirname(os.path.realpath(__file__)), "records.txt")

"""
C2 Server Information
"""
C2_PASSPHRASE = str.encode("ICT2101_P4_5_SERVER")
C2_HOSTIP = "0.0.0.0"
C2_PORT = 47656
C2_SOCKET_BUFSIZE = 1024
PING_INTERVAL = 10


def print_divider(message):
    console.rule(message)


def parse_message(message, tabs=0, symbol=None, symbol_style=None):
    if not symbol:
        return "\t" * tabs + message
    if symbol_style:
        return "\t" * tabs + f"[{symbol_style}][{symbol}][/{symbol_style}] " + message
    return "\t" * tabs + f"[{symbol}] " + message


def print_success(message, tabs=0, symbol="*", symbol_style=None):
    message = parse_message(message, tabs, symbol, symbol_style)
    console.print(message, style="bold green")


def print_info(message, tabs=0, symbol="*"):
    message = parse_message(message, tabs, symbol)
    console.print(message, style="bold cyan")


def print_danger(message, tabs=0, symbol="!"):
    message = parse_message(message, tabs, symbol)
    console.print(message, style="bold red")


def print_warning(message, tabs=0, symbol="*"):
    message = parse_message(message, tabs, symbol)
    console.print(message, style="bold yellow")


def print_white(message, tabs=0):
    message = parse_message(message, tabs, symbol="SENT")
    console.print(message, style="bold white")


def get_func_name():
    return inspect.stack()