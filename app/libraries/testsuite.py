"""
Author:  @ Ho Xiu Qi
Date:    6th December 2021

Class definition of project Whitebox Testing test suite
"""
import unittest
import sys
sys.path.insert(1, '../../app/libraries/')
from Challenge import *
from DatabaseManagement import *


class TestChallengeFeature(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        Function to run on TestChallengeManagement() init, to setup the necessary object instances 
        for testing the project's Challenge feature.

        The focus of this test suite is on Statement Coverage.
        """
        # ChallengeManagement instance for use throughout test cases
        cls.challenge_manager = ChallengeManagement()
        # Challenge instance for use throughout test cases 
        cls.test_challenge = cls.challenge_manager.createChallenge("test", "Easy", [1])
        # LeaderboardManagement instance for use throughout test cases
        cls.leaderboard_manager = LeaderboardManagement()
        # DatabaseManagement instance for use to interact with database throughout test cases
        cls.db_conn = DatabaseManagement()
        # Clear any existing leaderboard data
        cls.db_conn.writeIntoFile(CHALLENGE_RECORDS_FILE, "")

    def test_challengeCreation_feature(self):
        """
        Function to test if Challenge objects can be instantiated properly
        -> Calling of method to create the object was done at 'setUpClass()'
        """
        self.assertIsInstance(self.test_challenge, Challenge)

    def test_playerName_methods(self):
        """
        Function to test if 'playerName' attribute of the created Challenge object can 
        be successfully retrieved and modified
        """
        self.assertEqual(self.test_challenge.getPlayerName(), "test")
        self.test_challenge.setPlayerName("test2")
        self.assertEqual(self.test_challenge.getPlayerName(), "test2")

    def test_difficultyMode_methods(self):
        """
        Function to test if 'difficultyMode' attribute of the created Challenge object can 
        be successfully retrieved
        """
        self.assertEqual(self.test_challenge.getDifficultyMode(), "Easy")

    def test_startChallenge_feature(self):
        """
        Function to test starting a challenge for the created Challenge object
        """
        self.assertEqual(self.test_challenge.getActiveState(), False)
        self.challenge_manager.startChallenge(self.test_challenge)
        self.assertEqual(self.test_challenge.getActiveState(), True)

    def test_remainingCheckpoints_feature(self):
        """
        Function to test retrieving of the 'remainingCheckpoints' list of the created Challenge object
        """
        self.assertEqual(self.challenge_manager.getRemainingCheckpoints(self.test_challenge), [1])

    def test_removeCheckpoint_feature(self):
        """
        Function to test if the removal of checkpoints from the created Challenge obhect's remainingCheckpoint'
        list can be reliably rejected / accepted based on different conditions
        """
        # Test failure to remove checkpoint due to invalid next-in-line checkpoint
        self.assertFalse(self.challenge_manager.removeCheckpoint(self.test_challenge, 99))
        self.assertEqual(self.challenge_manager.getRemainingCheckpoints(self.test_challenge), [1])
        # Test success on removing checkpoint
        self.assertTrue(self.challenge_manager.removeCheckpoint(self.test_challenge, 1))
        self.assertEqual(self.challenge_manager.getRemainingCheckpoints(self.test_challenge), [])
        # Test failure to remove checkpoint due to remainingCheckpoints <= 0
        self.assertFalse(self.challenge_manager.removeCheckpoint(self.test_challenge, 1))
        self.assertEqual(self.challenge_manager.getRemainingCheckpoints(self.test_challenge), [])

    def test_completeChallenge_feature(self):
        """
        Function to test challenge completion of the created Challenge object
        """
        # Before completing challenge
        self.assertFalse(self.test_challenge.getActiveState())
        self.assertEqual(self.test_challenge.getRecordTime(), "")
        # Complete the challenge
        self.assertTrue(self.challenge_manager.completeChallenge(self.test_challenge, "00:59"))
        # After completing the challenge
        self.assertFalse(self.test_challenge.getActiveState())
        self.assertEqual(self.test_challenge.getRecordTime(), "00:59")

    def test_saveChallenge_feature(self):
        """
        Function to test if saving of a Challenge record in the database can be reliably allowed / rejected based 
        on different conditions
        """
        # Before saving challenge
        self.test_challenge.setActiveState(True)
        self.assertEqual(self.leaderboard_manager.getPastChallenges(self.db_conn), [])
        # Test failure to save challenge due to activeFlag == True
        self.assertFalse(self.leaderboard_manager.saveChallenge(self.db_conn, self.test_challenge))
        # Test success on saving challenge
        self.test_challenge.setActiveState(False)
        self.assertTrue(self.leaderboard_manager.saveChallenge(self.db_conn, self.test_challenge))
        self.assertEqual(self.leaderboard_manager.getPastChallenges(self.db_conn), [{'name':'test2','time':'00:59','difficulty':'Easy'}])



if __name__ == '__main__':
    unittest.main()
