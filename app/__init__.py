"""
Author:  @ Ho Xiu Qi
Date:    12th September 2021
Updated: 28th November 2021

Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions.
Form Validation with WTForms.
More Info:
Flask: http://flask.pocoo.org/
WTForms: http://flask.pocoo.org/docs/1.0/patterns/wtforms/
"""

# Imports
import queue
from flask import Flask, render_template, request, redirect, flash, session, jsonify, make_response
from flask_wtf.csrf import CSRFProtect

# Custom Script Imports
from .libraries.Listener import *            # C2 Comms (e.g. Handle Pi connections to C2)
from .libraries.DatabaseManagement import *  # DB Management (e.g. retrieval & saving of challenge settings / records)
from .libraries.Administrator import *       # Administrator account logon management
from .libraries.ChallengeSettings import *   # ChallengeSettings management
from .libraries.Challenge import *           # Challenge management
from .libraries.Student import *             # Student management

# DatabaseManagement Object
db_conn = DatabaseManagement()

# Administrator Object
adm = Administrator()
# AdministratorManagement Object
adm_manager = AdministratorManagement()

# ChallengeSettingsMangement Object
settings = ChallengeSettings(db_conn)
settings_manager = ChallengeSettingsManagement()

# ChallengeManagement Object
challenge_manager = ChallengeManagement()

# LeaderboardManagement Object
leaderboard_manager = LeaderboardManagement()

# StudentManagement & StudentActionManagement Object
student_manager = StudentManagement()
student_action_manager = StudentActionManagement()

# C2 server (listener) object
# c2_q = queue.Queue()
# c2_comms_obj = C2Server(c2_q)
# c2_comms_obj.onThread(c2_comms_obj.start())

# Flask Setup
app = Flask(__name__)   # initialise the flask app
app.config['SECRET_KEY'] = os.urandom(24)  # create the secret key

csrf = CSRFProtect(app) # protect the app from CSRF
csrf.init_app(app)      # initialise csrf protection for the app

# Global Variables
active_user = ""           # string var to contain username of currently logged in user
active_student = None      # var to store active "Student" account
active_challenge = None    # var to store active "Challenge" instance


# Index page route handler (direct to register page if no session, else direct to feature page)
@app.route('/')
def index():
    # Check for Session
    if not session.get('active'):
        return render_template('registerplayername.html')

    else:
        try:
            return redirect('/feature')

        except Exception:
            # if session expire, set the session to False
            session['active'] = False
            return redirect('/')

# Function that queues commands received from WebUI into the C2 server's "commands" list
@app.route('/register', methods=["POST"])
def register():
    if request.method == "POST":
        params = request.form
        # Get the comma separated commands as one string
        student = params.get("name")

        # Create the session
        session['active'] = True

        # Create new Student object with given name
        global active_student
        active_student = student_manager.registerPlayerName(student)

        # Set active Student's name
        global active_user
        active_user = student
        return redirect('/')


# Function to handle requests for the admin login page
@app.route('/adminlogin')
def adminlogin():
    global active_user

    # Check for Session
    if not session.get('active'):
        return render_template('adminlogin.html')

    # Logged on user is Administrator
    elif session.get('active') and active_user == ADMIN_NAME:
        try:
            return redirect('/editchallengesettings')     # change to editchallengesettings.html

        except Exception:
            # if session expire, set the session to False
            session['active'] = False
            return redirect('/')

    # Logged on user is NOT Administrator
    elif session.get('active') and active_user != ADMIN_NAME:
        try:
            return redirect('/feature')

        except Exception:
            # if session expire, set the session to False
            session['active'] = False
            return redirect('/')


# Function that handles Administrator login
@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        params = request.form
        # Get the comma separated commands as one string
        username = params.get("username")
        password = params.get("password")

        # Create new Administrator object with given name
        if adm_manager.login(adm, username, password) == True:
            # Set active Student's name
            global active_user
            active_user = username

            # Create the session
            session['active'] = True

            return redirect('/editchallengesettings')
        else:
            return redirect('/adminlogin')


# Function to serve the edit challenge settings page if user is logged on
@app.route('/editchallengesettings')
def editchallengesettings():
    # Check for Session
    if not session.get('active'):
        return redirect('adminlogin')

    # Return page for editing challenge settings (# of checkpoints)
    return render_template('editchallengesettings.html')


# Function to handle GET requests for default challenge settings
@app.route('/getDefaultSettings')
def getDefaultSettings():
    # Check for Session
    if not session.get('active'):
        return redirect('adminlogin')

    # Retreive challenge settings from DB using the settings_manager
    current_settings_list = settings_manager.getAllCheckpointCounts(settings)
    return jsonify({EASY_MODE:current_settings_list[EASY], MEDIUM_MODE:current_settings_list[MEDIUM], 
        HARD_MODE:current_settings_list[HARD]})


# Function to handle POST requests for changing the challenge settings
@app.route('/updateDefaultSettings', methods=["POST"])
def updateDefaultSettings():
    if request.method == "POST":
        params = request.form
        # Get the different checkpoint values for all difficulty modes
        easy = params.get("easy")
        medium = params.get("medium")
        hard = params.get("hard")

        # If settings successfully modified, return success message
        if settings_manager.modifyCheckpointCounts(settings, db_conn, [easy,medium,hard]):
            return make_response(jsonify({"msg": "OK"}), 200)
        else:
            return make_response(jsonify({"msg": "NOT ALLOWED"}), 405)


# Function to handle POST requests for creating a new Challenge
@app.route('/createChallenge', methods=["POST"])
def createChallenge():
    if request.method == "POST":
        params = request.form
        # Get the list of checkpoints
        difficulty = params.get("difficulty")
        checkpoints = params.get("checkpoints").split(',')
        checkpoint_count = len(checkpoints)

        # Create the Challenge object instanace
        global active_user
        global active_challenge
        # print_success(f"Player: {active_user}\nDifficulty: {difficulty}\nCheckpoints: {checkpoints}\nCheckpoint Count: {checkpoint_count}")
        active_challenge = challenge_manager.createChallenge(active_user, difficulty, checkpoint_count, checkpoints)
        return make_response(jsonify({"msg": "OK"}), 200)


# Function to handle POST requests for starting a Challenge
@app.route('/startChallenge', methods=["POST"])
def startChallenge():
    if request.method == "POST":
        # Call function to set the 'active' state for the challenge
        try:
            global active_challenge
            challenge_manager.startChallenge(active_challenge)
            return make_response(jsonify({"msg": "OK"}), 200)
        except Exception:
            return make_response(jsonify({"msg": "NOT ALLOWED"}), 405)
        


# Function to handle POST requests for saving a completed challenge's record time
@app.route('/saveChallenge', methods=["POST"])
def saveChallenge():
    if request.method == "POST":
        params = request.form
        # Get the different checkpoint values for all difficulty modes
        record_time = params.get("record_time")

        # Call 'challenge_manager's function to save the time elapsed into Challenge object instance
        global active_challenge
        challenge_manager.completeChallenge(active_challenge, record_time)

        # Call 'leaderboard_manager's function to save a record of the completed challenge into DB
        leaderboard_manager.saveChallenge(db_conn, active_challenge)
        
        # Reset (clear) the active challenge
        active_challenge = None

        # Reset Command History of Student
        global active_student
        student_action_manager.resetStudentCommandHistory(active_student)

        # Save the record time into challenge object
        return make_response(jsonify({"msg": "OK"}), 200)


# Function to handle equests for ID of car connected to server (assumed to be connected)
@app.route('/getCarID')
def getCarID():
    # Check for Session
    if not session.get('active'):
        return redirect('/')

    return jsonify({"id":"Lil' Runner"})


# Function to handle requests for pairing with a specific car
@app.route('/pairWithCar', methods=["POST"])
def pairWithCar():
    if request.method == "POST":
        params = request.form
        car_id = params.get("id")

        global active_student
        # If student has not paired with any car
        if active_student.getRoboticCarID() == "":
            student_action_manager.pairWithRoboticCar(active_student, car_id)
            return make_response(jsonify({"msg": "OK"}), 200)

        # Else If student is already paired with car
        else:
            return make_response(jsonify({"msg": "NOT ALLOWED"}), 405)


# Function to handle requests for de-pairing with a specific car
@app.route('/depairWithCar', methods=["POST"])
def depairWithCar():
    if request.method == "POST":
        params = request.form
        car_id = params.get("id")

        global active_student
        # If student has not paired with any car
        if active_student.getRoboticCarID() == "":
            return make_response(jsonify({"msg": "NOT ALLOWED"}), 405)
            
        # Else If student is already paired with car
        else:
            student_action_manager.depairRoboticCar(active_student)
            return make_response(jsonify({"msg": "OK"}), 200)


# Function to handle requests for retrieving leaderboard information
@app.route('/getLeaderboard')
def getLeaderboard():
    # Check for Session
    if not session.get('active'):
        return redirect('/')

    return jsonify(leaderboard_manager.getPastChallenges(db_conn))


# Function to handle requests for issuing arbitrary commands to the car
@app.route('/issueCommand', methods=["POST"])
def issueCommand():
    if request.method == "POST":
        params = request.form
        command = params.get("command")

        try:
            # Get next checkpoint to clear
            global active_challenge
            remaining = active_challenge.getRemainingCheckpoints()
            if len(remaining) > 0:
                next_cp = remaining[0]
            else:
                next_cp = NULL_RESPONSE

            # Get car's response
            if TESTING_MODE:
                car_response = next_cp
            else:
                car_response = next_cp      # placeholder for function call to send command to connected car

            # If still have checkpoints left
            if next_cp != NULL_RESPONSE:
                # Call function to remove crossed checkpoint
                # Internal checks will be done to see if checkpoint that car crossed is the next checkpoint
                challenge_manager.removeCheckpoint(active_challenge, car_response)

            # Assume command was sent successfully to car
            global active_student
            student_action_manager.addCommandToHistory(active_student, command)

            return make_response(jsonify({"msg": car_response}), 200)

        except Exception:
            return make_response(jsonify({"msg": "UNABLE TO SEND COMMAND"}), 405)


# Function to handle requests for removing checkpoints from challenge (it was crossed by the car)
@app.route('/getCommandHistory')
def getCommandHistory():
    # Check for Session
    if not session.get('active'):
        return redirect('/')
    
    global active_student
    cmd_history = student_action_manager.getStudentCommandHistory(active_student)
    return jsonify({"history":cmd_history})



# @app.route('/register_player')
# def register_player():

#     # Check for Session
#     if not session.get('active'):
#         return render_template('registerplayername.html')

#     # Return page for register_player
#     return render_template('registerplayername.html', active_user=active_user)


# # Function to update list of registered usernames
# def updateRegisteredUsers():
#     with open(CREDENTIALS_FILE, 'r') as f:
#         # Go through all users
#         for credential in f.readlines():
#             user = credential.split(',')[USERNAME]
#             salt = credential.split(',')[SALT]
#             hash = credential.split(',')[HASHED_PSW]

#             # Add any registered user that is in CREDENTIALS_FILE but not in global var 'registered_users'
#             if user not in registered_users.keys():
#                 registered_users[user] = {'salt': salt, 'hash': hash}


# @app.route('/register')
# def register():
#     # Return page for dashboard
#     return render_template('register.html')


# @app.route('/registeraccount', methods=["POST"])
# def registeraccount():
#     if request.method == "POST":
#         params = request.form
#         # Get the comma separated commands as one string
#         username = params.get("username")
#         password = params.get("password")
#         cfm_pass = params.get("password_confirm")

#         # Call function to ensure we have the latest list of usernames
#         updateRegisteredUsers()

#         # If user account already exist
#         if username in registered_users.keys():
#             flash(f"User '{username}' already exists!")
#             return redirect('/register')
#         # Else, new user trying to register
#         else:
#             # If passwords match
#             if password == cfm_pass:
#                 # Generate random salt
#                 salt = ''.join(random.choice(CHARACTERS) for i in range(16))

#                 # Hash the salt + password using <SHA512>
#                 hashed_password = hashlib.sha512(salt.encode('utf8') + password.encode('utf8')).hexdigest()

#                 # Store the username, salt and hashed password in the file system
#                 with open(CREDENTIALS_FILE, 'a') as f:
#                     f.write(username+","+salt+","+hashed_password+"\n")

#                 # Notify register account's success
#                 flash(f"Registered '{username}' successfully")
#                 return redirect('/register')

#             # Passwords don't match (typo by user)
#             else:
#                 flash("Password mismatch. Try again!")
#                 return redirect('/register')

# @app.route('/login')
# def loginpage():
#     # Return page for dashboard
#     return render_template('login.html')


# @app.route('/login', methods=["POST"])
# def login():
#     if request.method == "POST":
#         # Call function to ensure we have the latest list of usernames
#         updateRegisteredUsers()

#         # Get parameters from the POST form
#         params = request.form
#         # Get the comma separated commands as one string
#         username = params.get("username")
#         password = params.get("password")

#         # If user exists
#         if username in registered_users.keys():
#             # Get the salt of the user
#             stored_salt = registered_users[username]['salt']
#             # Calculate the hash of user's specified password
#             calculated_hash = hashlib.sha512(stored_salt.encode('utf8') + password.encode('utf8')).hexdigest()
#             stored_hash = registered_users[username]['hash']

#             psw_match = True

#             for i in range(len(calculated_hash)):
#                 if calculated_hash[i] != stored_hash[i]:
#                     print(f"[{i}]"+calculated_hash[i] + ":" + stored_hash[i])
#                     psw_match = False
#                     break

#             # Successful login
#             if psw_match == True:
#                 session['active'] = True
#                 global active_user
#                 active_user = username
#                 return redirect('/')
#             # Wrong Password, Unsuccessful login
#             else:
#                 flash("Wrong Password")
#                 return redirect('/')
#         else:
#             flash("No Such User!")
#             return redirect('/')


@app.route("/logout")
def logout():
    global active_user
    # Track the originally logged on user
    temp = active_user
    active_user = ""
    global active_student
    active_student = None
    session['active'] = False

    if temp == ADMIN_NAME:
        return redirect('/adminlogin')
    return redirect('/')

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    # note that we set the 500 status explicitly
    return render_template('500.html'), 500

@app.route('/home')
def home():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for dashboard
    return render_template('home.html', active_user=active_user)


@app.route('/profile')
def profile():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    return render_template('profile.html', active_user=active_user)


@app.route('/dashboard')
def dashboard():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    return render_template('dashboard.html', active_user=active_user)


@app.route('/hardwarespecs')
def hardwarespecs():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    return render_template('hardwarespecs.html', active_user=active_user)

@app.route('/leaderboard')
def leaderboard():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    return render_template('leaderboard.html', active_user=active_user)

@app.route('/feature')
def feature():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    # global active_student
    # print_info(active_student.getPlayerName())
    return render_template('feature.html', active_user=active_user)

@app.route('/control')
def control():
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    # Return page for profile
    return render_template('control.html', active_user=active_user)

# Function to get the all status info of a specific car (e.g. speed, is_upright etc...)
@app.route('/getcarinfo/<id>')
def getcarinfo(id):
    # # Check for Session
    if not session.get('active'):
        return redirect('/')

    info_list = dict()
    # Get the information of the specific car into a temp dictionary
    info_list["UPRIGHT"] = c2_comms_obj.connections[id]["UPRIGHT"]
    info_list["MOVING"] = c2_comms_obj.connections[id]["MOVING"]
    info_list["SPEED"] = c2_comms_obj.connections[id]["SPEED"]
    info_list["OBSTACLE"] = c2_comms_obj.connections[id]["OBSTACLE"]
    info_list["WIFI"] = c2_comms_obj.connections[id]["WIFI"]

    # Return dictionary in JSON format (more easy to read statuses on the Web UI using JS)
    return jsonify(c2_comms_obj.connections[id])


# Function that queues commands received from WebUI into the C2 server's "commands" list
@app.route('/queuecommands', methods=["POST"])
def queuecommands():
    if request.method == "POST":
        params = request.form
        # Get the comma separated commands as one string
        commands = params.get("commands")

        # Append the newly received commands from Web UI into the comms object's "commands" list
        for command in commands.split(','):
            c2_comms_obj.commands.append(command)