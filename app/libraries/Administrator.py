"""
Author:  @ Ho Xiu Qi
Date:    28th Novemeber 2021

Class definitions for Administrator ENTITY class and AdministratorMangagement CONTROL class
For defining and managing Administrator account logons
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
Class Definition for 'Administrator' entity class
"""
class Administrator():
	def __init__(self):
		self.name = ADMIN_NAME
		self.psw = ADMIN_PASS

	def getName(self):
		"""
		Function to get username of Administrator
		:return: Returns string representation of Administrator's username
		"""
		return self.name

	def getPassword(self):
		"""
		Function to get password of Administrator
		:return: Returns string representation of Administrator's password
		"""
		return self.psw
	
"""
Class Definition for 'AdministratorManagement' control class
"""
class AdministratorManagement():
	def __init__(self):
		pass

	def login(self, admin_obj, username, password):
		"""
		Function to perform authentication for Administrator logon using provided credentials
		:param username: String representation of username supplied by user
		:param password: String representation of password supplied by user
		:return: Returns True if logon success (correct credentials), else False
		"""
		if admin_obj.getName() == username:
			if admin_obj.getPassword() == password:
				return True
		return False
