"""
Author:  @ Ho Xiu Qi
Date:    28th November 2021

Class definitions for Challenge ENTITY class and ChallengeManagement CONTROL class
For defining and managing Challenge objects whenever new Challenges are started by students
"""


"""
Class Definition for 'Challenge' entity class
"""
class Challenge():
	# def __init__(self, playerName, difficultyMode, checkpointCount, remainingCheckpoints):
	def __init__(self, playerName, difficultyMode, remainingCheckpoints):
		self.playerName = playerName
		self.difficultyMode = difficultyMode
		# self.checkpointCount = checkpointCount
		self.remainingCheckpoints = remainingCheckpoints
		self.recordTime = ""
		self.active = False

	def getPlayerName(self):
		"""
		Function to get player name of Student tied to this challenge
		:return: Returns string representation of Administrator's username
		"""
		return self.playerName

	def setPlayerName(self, playerName):
		"""
		Function to set player name of Student tied to this challenge
		:param playerName: String representation of user's desired player name
		:return: Returns nothing
		"""
		self.playerName = playerName
	
	def getDifficultyMode(self):
		"""
		Function to get difficulty mode of this challenge
		:return: Returns string representation of current challenge's difficulty mode
		"""
		return self.difficultyMode

	def getRemainingCheckpoints(self):
		"""
		Function to get remaining checkpoints for this challenge
		:return: Returns list containing remaining checkpoints left for this challenge
		"""
		return self.remainingCheckpoints

	def setRemainingCheckpoints(self, new_checkpoints_list):
		"""
		Function to set (update) remaining checkpoints for this challenge
		:param new_checkpoints_list: List containing new remaining checkpoints for current challenge
		:return: Returns nothing
		"""
		self.remainingCheckpoints = new_checkpoints_list

	def getRecordTime(self):
		"""
		Function to get record time of this challenge (challenge is assumed to be completed at this time)
		:return: Returns string representation of current challenge's record time
		"""
		return self.recordTime

	def setRecordTime(self, recordTime):
		"""
		Function to set record time of this challenge (challenge is assumed to be completed at this time)
		:param recordTime: String representation of record time for user to complete the challenge
		:return: Returns nothing
		"""
		self.recordTime = recordTime

	def getActiveState(self):
		"""
		Function to get active status of current challenge
		:return: Returns True if challenge is active, else false
		"""
		return self.active

	def setActiveState(self, flag):
		"""
		Function to set active status of current challenge
		:param flag: Boolean flag (True/False) to represent if challenge is active or not
		:return: Returns nothing
		"""
		self.active = flag


"""
Class Definition for 'ChallengeManagement' control class
"""
class ChallengeManagement():
	def __init__(self):
		pass

	# def createChallenge(self, playerName, difficultyMode, checkpointCount, remainingCheckpoints):
	def createChallenge(self, playerName, difficultyMode, remainingCheckpoints):
		"""
		Function to perform authentication for Administrator logon using provided credentials
		:param playerName: String representation of user's player name
		:param difficultyMode: String representation of user's desired difficulty mode
		:param checkpointCount: Integer representation of total checkpoint count for selected difficulty mode
		:param remainingCheckpoints: List containing remaining checkpoints that user has left to clear
		:return: Returns a Challenge object instance
		"""
		# return Challenge(playerName, difficultyMode, checkpointCount, remainingCheckpoints)
		return Challenge(playerName, difficultyMode, remainingCheckpoints)

	def startChallenge(self, challenge):
		"""
		Function to set a given challenge object's active status to true
		:param challenge: Challenge object instance
		:return: Returns True if successfully set Challenge's state to active, else False
		"""
		challenge.setActiveState(True)
		if challenge.getActiveState() != True:
			return False
		return True

	def removeCheckpoint(self, challenge, checkpoint):
		"""
		Function to remove a checkpoint from the challenge's remaining checkpoints
		:param challenge: Challenge object instance
		:param checkpoint: Checkpoint to be removed from remainingCheckpoints of given challenge
		:return: Returns True if successfully removed a checkpoint, else False
		"""
		remaining = challenge.getRemainingCheckpoints();
		# Remove checkpoint if it is the first remaining checkpoint of given challenge
		if len(remaining) > 0:
			if checkpoint == remaining[0]:
				remaining.remove(checkpoint)
				challenge.setRemainingCheckpoints(remaining)
				return True
		return False

	def getRemainingCheckpoints(self, challenge):
		"""
		Function to retrieve remaining checkpoints from given challenge object
		:param challenge: Challenge object instance
		:return: Returns a list of remaining checkpoints of current challenge
		"""
		return challenge.getRemainingCheckpoints()

	def completeChallenge(self, challenge, recordTime):
		"""
		Function to set a given challenge object's active status to false and save the challenge as a record
		:param challenge: Challenge object instance
		:return: Returns True if challenge record was successfully completed and saved, else False
		"""
		# Set flag to indicate challenge completion
		challenge.setActiveState(False)

		# Track challenge completion (record) time
		challenge.setRecordTime(recordTime)
		if challenge.getRecordTime() == "":
			return False
		return True


"""
Class Definition for 'LeaderboardManagement' control class
"""
class LeaderboardManagement():
	def __init__(self):
		pass

	def getPastChallenges(self, db_conn):
		"""
		Function to retrieve all past challenges (records) from database
		:param db_conn: DatabaseManagement object instance for interacting with database
		:return: Returns list of past challenges (each challenge record is a dictionary)
		"""
		return db_conn.getChallengeRecords()

	def saveChallenge(self, db_conn, challenge):
		"""
		Function to save a completed challenge (record) into database
		:param db_conn: DatabaseManagement object instance for interacting with database
		:param challenge: Challenge object instance containing data of completed challenge
		:return: Returns True if Challenge successfully saved, else False
		"""
		# Save a record of the challenge in the database (leaderboard) if challenge is completed
		if not challenge.getActiveState():
			db_conn.addChallengeRecord([challenge.getPlayerName(), challenge.getRecordTime(), 
				challenge.getDifficultyMode()])
			return True

		return False
