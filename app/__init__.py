"""
Author:  @ Ho Xiu Qi
Date:    12th September 2021
Updated: 11th November 2021

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
from .libraries.Listener import *  # C2 Comms (e.g. Handle Pi connections to C2)

# C2 server (listener) object
c2_q = queue.Queue()
c2_comms_obj = C2Server(c2_q)
c2_comms_obj.onThread(c2_comms_obj.start())

# Setup
app = Flask(__name__)   # initialise the flask app
app.config['SECRET_KEY'] = os.urandom(24)  # create the secret key

csrf = CSRFProtect(app) # protect the app from CSRF
csrf.init_app(app)      # initialise csrf protection for the app


# Ensure credentials file is created
if not os.path.isfile(CREDENTIALS_FILE):
    with open(CREDENTIALS_FILE, 'w') as f:
        pass

# Global Variables
registered_users = dict()     # list to contain all registered users for the Web UI
active_user = ""           # string var to contain name of currently logged in user


@app.route('/')
def index():
    # Check for Session
    if not session.get('active'):
        return render_template('home.html')

    else:
        try:
            return redirect('/feature')

        except:
            # if session expire, set the session to False
            session['active'] = False
            flash('Session Expire')
            return redirect('/')


# Function to update list of registered usernames
def updateRegisteredUsers():
    with open(CREDENTIALS_FILE, 'r') as f:
        # Go through all users
        for credential in f.readlines():
            user = credential.split(',')[USERNAME]
            salt = credential.split(',')[SALT]
            hash = credential.split(',')[HASHED_PSW]

            # Add any registered user that is in CREDENTIALS_FILE but not in global var 'registered_users'
            if user not in registered_users.keys():
                registered_users[user] = {'salt': salt, 'hash': hash}


@app.route('/register')
def register():
    # Return page for dashboard
    return render_template('register.html')


@app.route('/registeraccount', methods=["POST"])
def registeraccount():
    if request.method == "POST":
        params = request.form
        # Get the comma separated commands as one string
        username = params.get("username")
        password = params.get("password")
        cfm_pass = params.get("password_confirm")

        # Call function to ensure we have the latest list of usernames
        updateRegisteredUsers()

        # If user account already exist
        if username in registered_users.keys():
            flash(f"User '{username}' already exists!")
            return redirect('/register')
        # Else, new user trying to register
        else:
            # If passwords match
            if password == cfm_pass:
                # Generate random salt
                salt = ''.join(random.choice(CHARACTERS) for i in range(16))

                # Hash the salt + password using <SHA512>
                hashed_password = hashlib.sha512(salt.encode('utf8') + password.encode('utf8')).hexdigest()

                # Store the username, salt and hashed password in the file system
                with open(CREDENTIALS_FILE, 'a') as f:
                    f.write(username+","+salt+","+hashed_password+"\n")

                # Notify register account's success
                flash(f"Registered '{username}' successfully")
                return redirect('/register')

            # Passwords don't match (typo by user)
            else:
                flash("Password mismatch. Try again!")
                return redirect('/register')

@app.route('/login')
def loginpage():
    # Return page for dashboard
    return render_template('login.html')


@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        # Call function to ensure we have the latest list of usernames
        updateRegisteredUsers()

        # Get parameters from the POST form
        params = request.form
        # Get the comma separated commands as one string
        username = params.get("username")
        password = params.get("password")

        # If user exists
        if username in registered_users.keys():
            # Get the salt of the user
            stored_salt = registered_users[username]['salt']
            # Calculate the hash of user's specified password
            calculated_hash = hashlib.sha512(stored_salt.encode('utf8') + password.encode('utf8')).hexdigest()
            stored_hash = registered_users[username]['hash']

            psw_match = True

            for i in range(len(calculated_hash)):
                if calculated_hash[i] != stored_hash[i]:
                    print(f"[{i}]"+calculated_hash[i] + ":" + stored_hash[i])
                    psw_match = False
                    break

            # Successful login
            if psw_match == True:
                session['active'] = True
                global active_user
                active_user = username
                return redirect('/')
            # Wrong Password, Unsuccessful login
            else:
                flash("Wrong Password")
                return redirect('/')
        else:
            flash("No Such User!")
            return redirect('/')


@app.route("/logout")
def logout():
    session['active'] = False
    global active_user
    active_user = ""
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
        return render_template('login.html')

    # Return page for dashboard
    return render_template('home.html', active_user=active_user)


@app.route('/profile')
def profile():
    # # Check for Session
    if not session.get('active'):
        return render_template('login.html')

    # Return page for profile
    return render_template('profile.html', active_user=active_user)


@app.route('/dashboard')
def dashboard():
    # # Check for Session
    if not session.get('active'):
        return render_template('login.html')

    # Return page for profile
    return render_template('dashboard.html', active_user=active_user)


@app.route('/hardwarespecs')
def hardwarespecs():
    # # Check for Session
    if not session.get('active'):
        return render_template('login.html')

    # Return page for profile
    return render_template('hardwarespecs.html', active_user=active_user)

@app.route('/leaderboard')
def leaderboard():
    # # Check for Session
    if not session.get('active'):
        return render_template('login.html')

    # Return page for profile
    return render_template('leaderboard.html', active_user=active_user)

@app.route('/feature')
def feature():
    # # Check for Session
    if not session.get('active'):
        return render_template('feature.html')

    # Return page for profile
    return render_template('feature.html', active_user=active_user)

@app.route('/control')
def control():
    # # Check for Session
    if not session.get('active'):
        return render_template('control.html')

    # Return page for profile
    return render_template('control.html', active_user=active_user)

@app.route('/control2')
def control2():
    # # Check for Session
    if not session.get('active'):
        return render_template('control2.html')

    # Return page for profile
    return render_template('control2.html', active_user=active_user)

# Function to get a list of all connected cars
@app.route('/getcars')
def getcars():
    return jsonify(c2_comms_obj.connections.keys())


# Function to get the all status info of a specific car (e.g. speed, is_upright etc...)
@app.route('/getcarinfo/<id>')
def getcarinfo(id):
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


@app.route('/adminlogin')
def adminloginpage():
    # Admin login page
    return render_template('adminlogin.html')