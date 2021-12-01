"""
Author:  @ Ho Xiu Qi
Date:    28th Novemeber 2021

Class definitions for Student ENTITY class, StudentMangagement & StudentActionManagement CONTROL class
For defining and managing Student sessions
"""

"""
Imports
"""
# import os
# try:
#     from .utils import *
# except ModuleNotFoundError:
#     print("[!] Unable to import utils.py, exiting program now.")
#     sys.exit()

"""
Class Definition for 'Student' entity class
"""
class Student():
	def __init__(self, playerName):
		self.playerName = playerName
		self.pairedRoboticCarID = str()
		self.commandHistory = []

	def getPlayerName(self):
		"""
		Function to get playerName of current Student
		:return: Returns string representation of Student's playerName
		"""
		return self.playerName

	def getRoboticCarID(self):
		"""
		Function to get car ID of the Student's paired robotic car
		:return: Returns string representation of paired robotic car's ID
		"""
		return self.pairedRoboticCarID

	def setRoboticCarID(self, ID):
		"""
		Function to set ID of the car that Student has paired with
		:param ID: String representation of paired robotic car's ID
		:return: Returns nothing
		"""
		self.pairedRoboticCarID = str(ID)

	def getCommandHistory(self):
		"""
		Function to get command history of current Student
		:return: Returns list containing commands that student has sent previously
		"""
		return self.commandHistory

	def setCommandHistory(self, new_cmd_list):
		"""
		Function to get command history of current Student
		:param new_cmd_list: List containing updated command history of Student
		:return: Returns nothing
		"""
		self.commandHistory = new_cmd_list


"""
Class Definition for 'StudentManagement' control class
"""
class StudentManagement():
	def __init__(self):
		pass

	def registerPlayerName(self, playerName):
		"""
		Function to register (create) a Student object for the user with given playerName
		:param playerName: String representation of player name supplied by user
		:return: Returns True if logon success (correct credentials), else False
		"""
		return Student(playerName)


"""
Class Definition for 'StudentActionManagement' control class
"""
class StudentActionManagement():
	def __init__(self):
		pass

	def pairWithRoboticCar(self, student, carID):
		"""
		Function to register (create) a Student object for the user with given playerName
		:param student: Student object instance
		:param carID: String representation of robotic car ID that Student paired with
		:return: Returns nothing
		"""
		student.setRoboticCarID(carID)

	def addCommandToHistory(self, student, command):
		"""
		Function to add a new command to a given Student's command history
		:param student: Student object instance
		:param command: String representation of command that Student just sent
		:return: Returns nothing
		"""
		cmd_history = student.getCommandHistory()
		cmd_history.append(command)
		student.setCommandHistory(cmd_history)
