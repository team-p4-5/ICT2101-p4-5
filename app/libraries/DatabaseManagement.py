"""
Author:  @ Ho Xiu Qi
Date:    28th Novemeber 2021

Class definition for DatabaseManagement CONTROL class for controlling the reading
and writing data of data with database.
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
Class Definition for 'DatabaseManagement' control class
"""
class DatabaseManagement():
	def __init__(self):
		# Ensure that the challenge settings and records file exists from the start
		self.createFileIfNotExist(CHALLENGE_SETTINGS_FILE)
		self.createFileIfNotExist(CHALLENGE_RECORDS_FILE)

	def createFileIfNotExist(self, file_path):
		"""
		Function to automatically create a file at given file_path if does not exist
		:param file_path: String representation of a file path that needs to exist
		:return: Returns nothing
		"""
		if not os.path.isfile(file_path):
			with open(file_path, 'w') as f:
				print_success(f"Creating \'{file_path}\'...")
				if file_path == CHALLENGE_SETTINGS_FILE:
					print_info(f"Creating default challenge settings: {DEFAULT_CHALLENGE_SETTINGS}")
					f.write(DEFAULT_CHALLENGE_SETTINGS)

	def readEverythingFromFile(self, file_path):
		"""
		Function to read all lines from file at given path
		:param file_path: String representation of a file path that needs to exist
		:return: Returns a LIST of strings, where each string is 1 line in the file
		"""
		return_list = list()
		with open(file_path, 'r') as f:
			return_list = f.readlines()
		return return_list

	def writeIntoFile(self, file_path, new_content):
		"""
		Function to overwrite file content at given path with new_content
		:param file_path: String representation of a file path that needs to exist
		:param new_content: String representation of new content to overwrite file with
		:return: Returns a LIST of strings, where each string is 1 line in the file
		"""
		with open(file_path, 'w') as f:
			f.write(new_content)

	def appendIntoFile(self, file_path, new_content):
		"""
		Function to append file content at given path with new_content
		:param file_path: String representation of a file path that needs to exist
		:param new_content: String representation of new content to append into file
		:return: Returns a LIST of strings, where each string is 1 line in the file
		"""
		with open(file_path, 'a') as f:
			f.writelines(new_content+"\n")

	def getChallengeSettings(self):
		"""
		Function to retrieve current challenge settings from database
		:return: Returns a dictionary representation of challenge settings
		"""
		self.createFileIfNotExist(CHALLENGE_SETTINGS_FILE)
		f_contents = self.readEverythingFromFile(CHALLENGE_SETTINGS_FILE)

		# Return parsed settings if they exist
		if len(f_contents) >= 1:
			list_of_settings = f_contents[0].split(',')
			return {'easy':int(list_of_settings[0]), 'medium':int(list_of_settings[1]), 'hard':int(list_of_settings[2])}
		# Else return default settings
		else:
			default_list_of_settings = DEFAULT_CHALLENGE_SETTINGS.split(',')
			return {'easy':int(default_list_of_settings[0]), 'medium':int(default_list_of_settings[1]), 'hard':default_list_of_settings[2]}

	def saveChallengeSettings(self, newChallengeSettings):
		"""
		Function to save provided challenge settings into database
		:param newChallengeSettings: List containing new challenge settings for 'Easy','Medium','Hard' (in order)
		:return: Returns True if save successful, else False
		"""
		self.writeIntoFile(CHALLENGE_SETTINGS_FILE, ",".join(newChallengeSettings))
		return True

	def getChallengeRecords(self):
		"""
		Function to retrieve existing challenge records (leaderboard information) from database
		:return: Returns a list of dictionaries
		"""
		self.createFileIfNotExist(CHALLENGE_RECORDS_FILE)
		f_contents = self.readEverythingFromFile(CHALLENGE_RECORDS_FILE)

		# Return list of dictionaries containing 'name','time','difficulty' of all records
		if len(f_contents) >= 1:
			list_of_records = list()
			for record in f_contents:
				if record != "\n":
					name,time,difficulty = record.strip().split(',')
					list_of_records.append({'name':name, 'time':time, 'difficulty':difficulty})
			return list_of_records
		# Else return default settings
		else:
			return []

	def addChallengeRecord(self, newChallengeRecord):
		"""
		Function to save provided challenge settings into database
		:param newChallengeSettings: List containing 'name','time','difficulty' data of new record (in order)
		:return: Returns True if save successful, else False
		"""
		self.appendIntoFile(CHALLENGE_RECORDS_FILE, ",".join(newChallengeRecord))
		return True
