# footpath-prototype
Initial Simulation Experiment Plan
The purpose of our experiment is to compare the localization accuracy of FootPath and FootPath + Vista (only equipped on one side) + Particle Filter algorithm.

There are following map & user behavior variations:

User’s walk behavior types (UWB): 
1. User follows the expected path more or less 
2. User strays from the expected path

User’s path types (UP): 
1. The expected path is straight (not involving any turns) 
2. The expected path involves turns

Wall types (W): (this matters if user is walking a path along the wall)
1. The wall contains doors 
2. The wall doesn’t contain doors 

To consider all combination of above cases, we have 2^3 = 8 test cases.



