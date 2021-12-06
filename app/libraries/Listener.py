"""
Author:  @ Ho Xiu Qi
Date:    6th December 2021

Class definition for 'low-level' programming for communications with robotic car
"""

# Custom libraries
try:
    from .utils import *
except ModuleNotFoundError:
    print("[!] Unable to import utils.py, exiting program now.")
    sys.exit()


class C2Server(threading.Thread):
    def __init__(self, q):
        super(C2Server, self).__init__()

        self.queue = q
        self.host = C2_HOSTIP
        self.port = C2_PORT
        self.connections = {}       # dictionary containing info of connections
        self.all_threads = []       # store all handle_client threads
        self.commands = []          # to store all commands sent by user
        self.running = False        # flag that indicates if C2Server is running
        self.out_of_loop = False    # flag that indicates when the C2Server exits gracefully

    def onThread(self, function, *args, **kwargs):
        # Function to put a given function into the queue to execute
        self.queue.put((function, args, kwargs))

    def run(self):
        # Starts the C2 server
        self.start_server()

    def handle_client(self, conn, addr):
        conn.settimeout(30)

        buf = conn.recv(C2_SOCKET_BUFSIZE).decode("utf-8")
        uid, device = buf.split()

        if "ICT2101_P4_5_CAR" == device.lower():
            conn.sendall(C2_PASSPHRASE)

        car_id, is_upright, is_moving, speed, obstacle_met, wifi_strength = None, None, None, None, None, None

        print_info(f"Car with UID [bold magenta underline]{uid}[/bold magenta underline] has connected!")

        # Create a object for this connection in the "connections" dictionary
        self.connections[uid] = {"CONN": conn, "ADDR": addr[0]}

        try:
            while 1:
                try:
                    time.sleep(PING_INTERVAL)

                    # Sends all commands to the car
                    # -> Assumes that car can have a buffer to store and execute them 1 by 1
                    # -> "EXEC:" is just a short string to instruct car to execute whichever commands that follow,
                    #       where each command is separated by a ">>"
                    command = "EXEC:"+">>".join(self.commands)
                    conn.sendall(str.encode(command))
                    print_success(f"Sent command: {command}")

                    # Receive client's status reply in the format:
                    #       "STAT:car_id,is_upright,is_moving,speed,obstacle_met,wifi_strength"
                    buf = conn.recv(C2_SOCKET_BUFSIZE).decode("utf-8")
                    print_info(f"Received Status from Car: {buf}")

                    # Checks if this is a STAT update from car
                    if "STAT:" in buf:
                        buf = buf.split("STAT:")[1]
                        car_id, is_upright, is_moving, speed, obstacle_met, wifi_strength = buf[0], buf[1], buf[2], buf[
                            3], buf[4], buf[5].split()

                        # Update the stats of the respective car
                        self.connections[car_id]["UPRIGHT"] = is_upright
                        self.connections[car_id]["MOVING"] = is_moving
                        self.connections[car_id]["SPEED"] = speed
                        self.connections[car_id]["OBSTACLE"] = obstacle_met
                        self.connections[car_id]["WIFI"] = wifi_strength

                except KeyError:
                    # Create the dictionary entry for the current car if it does not already exist
                    self.connections[car_id] = {"CONN": conn, "ADDR": addr[0]}

        except BrokenPipeError as e:
            # Client has disconnected
            print_danger(f"Client not alive: [Broken Pipe] {e}")
            pass
        except ConnectionResetError as e:
            # Client has disconnected
            print_danger(f"Client not alive: [Connection Reset] {e}")
            pass
        except TimeoutError as e:
            print_danger(f"Client not alive: [Timeout] {e}")
            pass
        except socket.timeout as e:
            print_danger(f"Client not alive: [Socket Timeout] {e}")
            pass

        print_info(f"Car with UID [bold magenta underline]{uid}[/bold magenta underline] has disconnected!")

        del self.connections[uid]

    def start_server(self):
        # Function that procures necessary resources (e.g. port) and starts the server
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        try:
            # Binds the ip/port for our C2 server
            server_socket.bind((self.host, self.port))
        except OSError as e:
            print_danger(f"{e}!")
            print_info(
                "If you had recently closed a socket program, please wait for the socket to exit or "
                "manually terminate it in your process monitor.", tabs=1)
            return False

        self.running = True
        server_socket.settimeout(2.5)
        print_divider(f"[bold magenta]Server started: [{self.host}:{self.port}]")
        server_socket.listen(5)
        self.out_of_loop = False

        while self.running:
            try:
                with console.status(
                        f"[bold cyan]Waiting for connection... [underline]{len(self.connections)}[/underline] {'client' if len(self.connections) == 1 else 'clients'} | {[i for i in self.connections]}"):
                    conn, addr = server_socket.accept()

                # Create new thread to handle a new car's connection
                new_thread = threading.Thread(target=self.handle_client, args=(conn, addr))
                self.all_threads.append(new_thread)
                # Start the thread to handle the new car connection
                new_thread.start()
            except socket.timeout:
                pass

        self.out_of_loop = True

    def stop(self):
        self.running = False
        print_warning("Terminating C2 Server")

        # Waiting for main loop in start_server() to be exited before continuing
        # Reason: There can only be 1 console.status active at one time
        while not self.out_of_loop:
            time.sleep(0.5)

        try:
            with console.status("[bold cyan]Disconnecting all cars..."):
                for uid, info, thread in zip(self.connections.items(), self.all_threads):
                    print_info(f"Terminating car {uid}@{info['ADDR']}")
                    info["CONN"].shutdown(socket.SHUT_RDWR)
                    info["CONN"].close()
                    thread.join()
        except ValueError as e:
            print(self.connections.items(), len(self.connections.items()), e)

        print_success("Successfully terminated.", symbol="C2 Server", symbol_style="bold magenta")

    # def send_command(self, ip, message):
    #     for uid, info in self.connections.items():
    #         if ip == info["ADDR"]:
    #             print_info(f"Sending Commands to \'{uid}@{ip}: {message}\'")
    #             info["CONN"].sendall(message)
    #             return True
    #
    #     print_warning(f"Cannot find target ip \'{ip}\' in list of connected cars")
    #     return False
