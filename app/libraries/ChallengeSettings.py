"""
Author:  @ Ho Xiu Qi
Date:    28th November 2021

Class definitions for ChallengeSettings ENTITY class and ChallengeSettingsManagement CONTROL class
For defining and managing challenge settings retrieval and modifications methods
"""

"""
Imports
"""
import os
try:
    from .utils import *
except ModuleNotFoundError:
    print("[!] Unable to import utils.py, exiting program now.")
    sys.exit()

"""
Class Definition for 'ChallengeSettings' entity class
"""
class ChallengeSettings():
	def __init__(self, db_conn):
		# Establish database management object on init
		# self.db_conn = DatabaseManagement()

		# Retrieve challenge settings from the database
		# challenge_settings = self.db_conn.getChallengeSettings()
		challenge_settings = db_conn.getChallengeSettings()

		# Initialise checkpoint counts for difficulty levels using values from db
		self.easyModeCheckpoints = int(challenge_settings[EASY_MODE])
		self.mediumModeCheckpoints = int(challenge_settings[MEDIUM_MODE])
		self.hardModeCheckpoints = int(challenge_settings[HARD_MODE])

	def getEasyModeCheckpoints(self):
		"""
		Function to get number of checkpoints for easy mode
		:return: Returns integer representation of checkpoint count for easy mode
		"""
		return self.easyModeCheckpoints

	def setEasyModeCheckpoints(self, new_easy_count):
		"""
		Function to set number of checkpoints for easy mode
		:param new_easy_count: Integer representation of new number of checkpoints for easy mode
		:return: Returns nothing
		"""
		self.easyModeCheckpoints = new_easy_count


	def getMediumModeCheckpoints(self):
		"""
		Function to get number of checkpoints for medium mode
		:return: Returns integer representation of checkpoint count for medium mode
		"""
		return self.mediumModeCheckpoints

	def setMediumModeCheckpoints(self, new_medium_count):
		"""
		Function to set number of checkpoints for medium mode
		:param new_medium_count: Integer representation of new number of checkpoints for medium mode
		:return: Returns nothing
		"""
		self.mediumModeCheckpoints = new_medium_count

	def getHardModeCheckpoints(self):
		"""
		Function to get number of checkpoints for hard mode
		:return: Returns integer representation of checkpoint count for hard mode
		"""
		return self.hardModeCheckpoints

	def setHardModeCheckpoints(self, new_hard_count):
		"""
		Function to set number of checkpoints for hard mode
		:param new_hard_count: Integer representation of new number of checkpoints for hard mode
		:return: Returns nothing
		"""
		self.hardModeCheckpoints = new_hard_count
	

"""
Class Definition for 'ChallengeSettingsManagement' control class
"""
class ChallengeSettingsManagement():
	def __init__(self):
		pass

	def getAllCheckpointCounts(self, challenge_settings_obj):
		"""
		Function to get checkpoint counts for all modes
		:param challenge_settings_obj: ChallengeSettings object instance
		:return: Returns a list containing checkpoint counts for all modes in order of 'easy','medium','hard'
		"""
		return [challenge_settings_obj.getEasyModeCheckpoints(),
		challenge_settings_obj.getMediumModeCheckpoints(),
		challenge_settings_obj.getHardModeCheckpoints()]

	def getSpecificCheckpointCount(self, challenge_settings_obj, difficulty_mode):
		"""
		Function to get checkpoint count for a specific difficulty mode
		:param challenge_settings_obj: ChallengeSettings object instance
		:param difficulty_mode: String representation of difficulty mode that user is interested in
		:return: Returns integer representation of checkpoint count for a specified difficulty mode
		"""
		if difficulty_mode == EASY_MODE:
			return challenge_settings_obj.getEasyModeCheckpoints()
		elif difficulty_mode == MEDIUM_MODE:
			return challenge_settings_obj.getMediumModeCheckpoints()
		elif difficulty_mode == HARD_MODE:
			return challenge_settings_obj.getHardModeCheckpoints()

	def validateCheckpointInput(self, checkpoint_input):
		"""
		Function to check if user's input checkpoint count is a valid integer >0
		:param input: Integer representation of checkpoint count input by user
		:return: Returns True if valid checkpoint count, else False
		"""
		try:
			if int(checkpoint_input) > 0:
				return True
		except ValueError:
			return False

	def modifyCheckpointCounts(self, challenge_settings_obj, db_conn, new_checkpoint_values):
		"""
		Function to modify checkpoint count values in given challenge_settings_obj and database
		:param challenge_settings_obj: ChallengeSettings object instance
		:param db_conn: DatabaseManagement object instance for interacting with database
		:param new_checkpoint_values: List containing new checkpoint values to save in order of 'easy','medium','hard'
		:return: Returns True if checkpoint counts modified successfully, else False
		"""
		values = list()
		for value in new_checkpoint_values:
			if not self.validateCheckpointInput(value):
				print(f"[-] Invalid input: {value}")
				return False
			values.append(str(value))

		# Modify local copy of respective checkpoint values in 'challenge_settings_obj'
		challenge_settings_obj.setEasyModeCheckpoints(new_checkpoint_values[EASY])
		challenge_settings_obj.setMediumModeCheckpoints(new_checkpoint_values[MEDIUM])
		challenge_settings_obj.setHardModeCheckpoints(new_checkpoint_values[HARD])

		# Commit changes to database using 'db_conn' in 'challenge_settings_obj'
		# challenge_settings_obj.db_conn.saveChallengeSettings(values)
		db_conn.saveChallengeSettings(values)

		return True
