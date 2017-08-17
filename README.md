# footpath-prototype
Initial Simulation Experiment Plan

The purpose of our experiment is to compare the localization accuracy of FootPath and FootPath + Vista (only equipped on one side) + Particle Filter algorithm.

There are following map & user behavior variations:

User’s walk behavior types: 
1. User follows the expected path more or less 
2. User strays from the expected path

User’s path types: 
1. The expected path is straight (not involving any turns) 
2. The expected path involves turns

Wall types: 
1. The wall contains closed doors 
2. The wall contains open doors
3. The wall doesn’t contain doors 
4. The wall contains closed and open doors (random)

To consider all combination of above cases, we have 12 test cases.

We will compare the accuracy of FootPath and FootPath + Vista (only equipped on one side) + Particle Filter algorithm in the following ways:
1. visual: We'll provide a graph with three paths, each in different color for each test case
a. user's actual path 
b. footpath's estimated user's path 
c. footpath+vista+particle filter estimated user's path

2. distance: We'll calculate the distance between the followings using the distance between two points formula:
a. user's actual location and FootPath estimated user's location, one step at a time for all steps
b. user's actual location and FootPath + Vista + Particle Filter estimated user's location, one step at a time for all steps
Later, we take an average difference for each result for comparison.
3. angle: We'll calculate the angle difference between the followings:
a. user's actual angle and FootPath estimated user's angle, one step at a time for all steps
b. user's actual angle and FootPath + Vista + Particle Filter estimated user's angle, one step at a time for all steps
Later, we take an average difference for each result for comparison.


